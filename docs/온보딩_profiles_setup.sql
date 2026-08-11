-- =========================================================
-- 1) public.profiles 테이블 생성
--    - id: auth.users(id)를 참조하는 FK이면서 동시에 PK
--          (auth.users 행이 삭제되면 profiles 행도 함께 삭제)
--    - purpose / main_problem / expected_feature: 온보딩 질문 3개 답변
--      (질문/축 매핑은 docs/온보딩_질문_후보.md 참고)
--        · purpose          : check_expected_score | improve_speaking | realistic_practice
--        · main_problem     : lack_realistic_practice | hard_to_self_assess
--                              | no_expert_feedback | lack_practice_sets
--        · expected_feature : goal_al | goal_ih | goal_im | no_goal
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  onboarding_completed boolean not null default false,
  purpose text,
  main_problem text,
  expected_feature text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 2) RLS(Row Level Security) 활성화
--    활성화만 하면 정책이 없는 한 아무도 접근 못하므로,
--    아래 3번에서 select/insert/update 정책을 각각 추가한다.
-- =========================================================
alter table public.profiles enable row level security;

-- =========================================================
-- 3) RLS 정책: select / insert / update 각각 "자기 자신의 행"만 허용
--    - select: 조회 대상 행 자체를 auth.uid() = id 로 제한 (using)
--    - insert: 새로 넣으려는 행의 id가 auth.uid()와 같아야 함 (with check)
--    - update: 수정 대상 행 조회(using)와 수정 후 결과(with check) 둘 다 제한
-- =========================================================
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =========================================================
-- 4) auth.users에 새 사용자가 생성되면 public.profiles에
--    대응 행(id, email)을 자동 생성하는 트리거 함수 + 트리거
--    - security definer: auth.users 트리거는 profiles insert 시
--      RLS(auth.uid() = id)를 통과할 세션 컨텍스트가 없으므로
--      정의자 권한으로 실행해 RLS를 우회해야 함
--    - search_path 명시: security definer 함수의 스키마 하이재킹 방지
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =========================================================
-- [검증용 조회 쿼리] 아래는 실행 후 상태 확인용이며,
-- 위 생성 블록과 별개로 필요할 때만 실행하면 됩니다.
-- =========================================================

-- 4-1) RLS가 켜져 있는지 확인 (rowsecurity = true 여야 함)
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public' and tablename = 'profiles';

-- 4-2) 정책이 select/insert/update 3개 다 생성됐는지 확인
select policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'profiles'
order by cmd;

-- 4-3) 트리거가 auth.users에 걸려 있는지 확인
select tgname, tgrelid::regclass as table_name, tgenabled
from pg_trigger
where tgname = 'on_auth_user_created';
