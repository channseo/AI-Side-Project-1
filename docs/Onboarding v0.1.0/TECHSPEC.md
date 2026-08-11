# OPIC AI Mock Interview Coach — TECHSPEC (온보딩 v0.1.0)

> 본 문서는 `PRD.md` / `기능명세서.md` / `designsystem.md`를 기반으로, 회원가입·로그인 이후 진행되는 온보딩(purpose/main_problem/expected_feature 수집) 기능의 파일 구조와 구현 순서를 정의합니다. 코드 구현 전 계획 단계 문서이며, 실제 구현 시 세부 사항은 변경될 수 있습니다.

## 1. 문서 개요

| 항목 | 내용 |
|---|---|
| 문서 목적 | 온보딩 기능(멀티스텝 폼 → 라우팅 → 저장 → 조회 → 개인화)의 신규/수정 파일 구조와 구현 순서 정의 |
| 대상 독자 | 프론트엔드 개발자 |
| 범위 | 회원가입/로그인 이후 온보딩 3문항 응답 수집, `profiles` 저장/조회, Home 페이지 개인화 |
| 범위 제외 | `profiles` 테이블/RLS/트리거 자체의 스키마 설계(완료 — `docs/온보딩_profiles_setup.sql` 참고), 온보딩 질문 문구/옵션 확정(완료 — `docs/온보딩_질문_후보.md` 참고) |
| 관련 문서 | `PRD.md`, `기능명세서.md`, `designsystem.md`, `docs/온보딩_profiles_setup.sql`, `docs/온보딩_질문_후보.md` |
| 대상 파일 | 아래 3절 참고 |

---

## 2. 현재 상태 요약

- 이메일/비밀번호 회원가입(`src/pages/SignUp.tsx`)·로그인(`src/pages/Login.tsx`)·로그아웃(`src/components/AuthStatus.tsx`)은 구현 완료. Auth 세션은 `useAuthStore`(Zustand) + `useAuthSession` 훅(`supabase.auth.onAuthStateChange` 구독, `App.tsx`에서 호출)으로 관리됨
- `public.profiles` 테이블, RLS(select/insert/update 각각 `auth.uid() = id`), `auth.users` insert 트리거(`handle_new_user`)는 SQL로 설계 완료. 회원가입 시 `id`, `email`만 채워진 행이 자동 생성되고 `onboarding_completed`는 기본값 `false`
- 온보딩 질문 3축(Purpose/Problem/Expectation)과 옵션 코드값은 `docs/온보딩_질문_후보.md`에서 확정되었고, `profiles` 테이블의 `purpose`/`main_problem`/`expected_feature` 컬럼과 1:1로 대응됨
- `SignUp.tsx`/`Login.tsx`는 성공 시 무조건 `navigate('/')`로 이동 — 온보딩 완료 여부를 확인하는 로직 없음
- `App.tsx`에 `/onboarding` 라우트 없음. 온보딩 폼, `profiles` 조회/저장 관련 파일 없음
- 프로젝트에 별도 Dashboard 페이지는 없음 — "개인화"는 Home(`/`) 페이지에 로그인 + 온보딩 완료 사용자 대상 조건부 UI로 반영(사용자 확인 완료)

---

## 3. 변경 사항 요약

| ID | 변경 항목 | 유형 | 대상 파일 |
|---|---|---|---|
| TS-ONB-01 | 온보딩 멀티스텝 폼 페이지 | 신규 | `src/pages/Onboarding.tsx` |
| TS-ONB-02 | 가입/로그인 성공 후 온보딩 라우팅 분기 | 수정 | `src/pages/SignUp.tsx`, `src/pages/Login.tsx`, `src/App.tsx` |
| TS-ONB-03 | 온보딩 답변 `profiles` 저장 | 신규 | `src/api/profile.ts` |
| TS-ONB-04 | `profiles` 읽기(세션 연동 자동 조회) | 신규 | `src/store/useProfileStore.ts`, `src/hooks/useProfileSession.ts` |
| TS-ONB-05 | Home 페이지 개인화 | 수정 | `src/pages/Home.tsx` |

공통 선행 작업으로 `src/types/index.ts`에 `Profile` 및 온보딩 응답 관련 타입을 추가한다.

---

## 4. 신규/수정 파일 구조

```
src/
├── api/
│   └── profile.ts                 # [신규] fetchProfile, saveOnboardingAnswers
├── store/
│   ├── useAuthStore.ts            # (기존, 변경 없음)
│   └── useProfileStore.ts         # [신규] profiles 행 상태 보관
├── hooks/
│   ├── useAuthSession.ts          # (기존, 변경 없음)
│   └── useProfileSession.ts       # [신규] 세션 변화에 따라 profile fetch
├── pages/
│   ├── Onboarding.tsx             # [신규] 멀티스텝 폼 (`/onboarding`)
│   ├── SignUp.tsx                 # [수정] 성공 후 분기 라우팅
│   ├── Login.tsx                  # [수정] 성공 후 분기 라우팅
│   └── Home.tsx                   # [수정] 로그인+온보딩 완료 사용자 개인화 섹션
├── types/
│   └── index.ts                   # [수정] Profile, 온보딩 응답 타입 추가
└── App.tsx                        # [수정] `/onboarding` 라우트, useProfileSession 호출
```

새 컴포넌트 디렉토리(`src/components/onboarding/` 등)는 만들지 않는다. `SignUp.tsx`/`Login.tsx`처럼 페이지 하나가 자기 완결적으로 폼 상태를 갖는 기존 컨벤션을 따르고, 스텝 구성은 `Home.tsx`의 `steps`/`faqs` 배열처럼 컴포넌트 내부 상수 배열로 정의한다. 스텝 수가 늘어나 파일이 비대해질 때만 분리한다.

---

## 5. TS-ONB-01: 온보딩 멀티스텝 폼

### 5.1 배경

`docs/온보딩_질문_후보.md`에서 확정된 3문항(Purpose 3지선다, Problem 4지선다, Expectation 4지선다)을 한 화면씩 순서대로 보여주고 마지막에 제출하는 폼이 필요하다.

### 5.2 구현 가이드

| 항목 | 내용 |
|---|---|
| 파일 | `src/pages/Onboarding.tsx` (단일 페이지, `/onboarding`) |
| 상태 관리 | 로컬 `useState`로 충분 — 현재 스텝 인덱스(0~2), 선택된 답변(`purpose`/`main_problem`/`expected_feature`). 이 상태는 제출 전까지 이 페이지 밖에서 필요하지 않으므로 별도 Zustand 스토어를 만들지 않는다(`useInterviewStore`처럼 페이지 간 공유가 필요한 경우와는 다름) |
| 질문 데이터 | 컴포넌트 내부 상수 배열 `onboardingSteps`(`key`, `question`, `options: {label, value}[]`) — `docs/온보딩_질문_후보.md` 3절 최종 후보 표의 문구/코드값 그대로 사용 |
| 진행 표시 | 상단에 "1/3" 형태 텍스트 또는 `designsystem.md` §5.4 탭 스타일 재사용(점 3개 인디케이터) |
| 이동 | 각 스텝에서 옵션 선택 시 자동으로 다음 스텝 이동, 또는 "다음" 버튼(`designsystem.md` §5.1 Primary 알약형 버튼) 클릭 시 이동. 이전 스텝으로 돌아가는 "이전" 버튼도 제공 |
| 제출 | 마지막 스텝에서 "완료" 버튼 클릭 시 TS-ONB-03의 `saveOnboardingAnswers` 호출 → 성공 시 `useProfileStore` 갱신 → `/`로 이동 |
| 접근 제한 | 로그인하지 않은 사용자가 `/onboarding`에 직접 접근하면 `/login`으로 리다이렉트(비회원은 `profiles` 행 자체가 없음) |
| 로딩/에러 | 저장 API 실패 시 에러 메시지 노출 + 재시도 가능(페이지 이동 없음), 기존 `SignUp.tsx`/`Login.tsx`의 에러 메시지 스타일(`bg-[#f3f3f3]`, `text-danger`) 재사용 |

---

## 6. TS-ONB-02: 가입/로그인 후 온보딩 라우팅

### 6.1 배경

현재 `SignUp.tsx`/`Login.tsx`는 성공 시 무조건 `/`로 이동한다. 온보딩을 완료하지 않은 사용자는 `/onboarding`으로, 이미 완료한 사용자는 기존대로 `/`로 보내야 한다.

### 6.2 구현 가이드

| 항목 | 내용 |
|---|---|
| 판단 시점 | `signUp`/`signInWithPassword` 성공 직후, 응답으로 받은 `user.id`로 TS-ONB-04의 `fetchProfile(userId)`를 **직접 호출**해 `onboarding_completed` 값을 확인한다. `useProfileStore` 구독 갱신 타이밍에 의존하면(비동기 `onAuthStateChange` 콜백 경합) 리다이렉트 시점에 값이 아직 반영 안 됐을 수 있으므로, 핸들러 내에서 직접 fetch 후 즉시 분기한다 |
| SignUp.tsx | `data.session`이 있는 경우(이메일 인증 미사용 설정)만 해당. `fetchProfile` 결과 `onboarding_completed === false`이면 `navigate('/onboarding')`, 아니면 `navigate('/')`. `data.session`이 없는 이메일 인증 대기 분기는 기존 안내 메시지 그대로 유지(이 경우 아직 로그인 상태가 아니므로 온보딩 라우팅 대상 아님) |
| Login.tsx | 로그인 성공 후 동일하게 `fetchProfile(userId)` 결과로 `/onboarding` 또는 `/` 분기 |
| App.tsx | `/onboarding` 라우트를 추가하고, `useAuthSession()`과 함께 `useProfileSession()`을 호출해 이후 세션 유지 중에도 `useProfileStore`가 최신 상태를 갖도록 한다(TS-ONB-04 참고) |
| 범위 밖(향후 고려) | "이미 로그인된 상태에서 온보딩 미완료 사용자가 URL로 다른 페이지에 직접 진입"하는 경우를 막는 전역 라우트 가드는 이번 범위에 포함하지 않는다. 필요해지면 `App.tsx`에 `RequireOnboarding` 래퍼를 추가하는 방향으로 확장한다 |

---

## 7. TS-ONB-03: 온보딩 답변 저장

### 7.1 배경

온보딩 폼 제출 시 3개 답변과 완료 플래그를 `profiles` 행에 반영해야 한다. `profiles`는 RLS로 "자기 자신의 행"만 update 가능하도록 이미 보호되어 있으므로, `SignUp`/`Login`과 동일하게 **백엔드(Express) 경유 없이 프론트엔드에서 Supabase anon key로 직접 호출**한다(CLAUDE.md의 Auth 직접 호출 패턴과 동일 — RLS가 보안 경계를 담당하며 service role key나 비밀값이 필요하지 않음).

### 7.2 구현 가이드

| 항목 | 내용 |
|---|---|
| 파일 | `src/api/profile.ts` |
| 함수 | `saveOnboardingAnswers(userId: string, answers: { purpose, mainProblem, expectedFeature }): Promise<Profile>` |
| 동작 | `supabase.from('profiles').update({ purpose, main_problem: mainProblem, expected_feature: expectedFeature, onboarding_completed: true, updated_at: new Date().toISOString() }).eq('id', userId).select().single()` |
| 매핑 | DB는 snake_case(`main_problem`, `expected_feature`), 프론트 타입은 camelCase(`Profile.mainProblem` 등) — `api/profile.ts` 내부에서 변환해 컴포넌트/스토어는 camelCase만 다루도록 한다 |
| 에러 처리 | Supabase 오류 시 예외를 던지고, 호출부(`Onboarding.tsx`)에서 잡아 에러 메시지 표시 |

---

## 8. TS-ONB-04: `profiles` 읽기

### 8.1 배경

로그인 직후 라우팅 분기(TS-ONB-02)와 Home 개인화(TS-ONB-05) 모두 현재 사용자의 `profiles` 행을 필요로 한다. `useAuthStore` + `useAuthSession`과 동일한 패턴으로 세션에 연동된 조회 로직을 둔다.

### 8.2 구현 가이드

| 항목 | 내용 |
|---|---|
| 파일 | `src/store/useProfileStore.ts`, `src/hooks/useProfileSession.ts`, `src/api/profile.ts`(`fetchProfile` 함수 추가) |
| `fetchProfile(userId)` | `supabase.from('profiles').select('*').eq('id', userId).single()` → camelCase `Profile`로 매핑해 반환 |
| `useProfileStore` | `{ profile: Profile \| null, isLoaded: boolean, setProfile: (profile: Profile \| null) => void }` — `useAuthStore`와 동일한 최소 구조 |
| `useProfileSession` | `useAuthStore`의 `user`를 구독, `user`가 바뀔 때(로그인/로그아웃)마다 `user`가 있으면 `fetchProfile` 호출 후 `setProfile`, 없으면 `setProfile(null)` 및 `isLoaded: true` |
| 호출 위치 | `App.tsx`에서 `useAuthSession()` 다음 줄에 `useProfileSession()` 호출 |
| 재조회 시점 | TS-ONB-03 저장 성공 직후 `Onboarding.tsx`에서 저장 API 응답(`Profile`)으로 `useProfileStore.setProfile()`을 직접 갱신 — 별도 재조회(refetch) 불필요 |

---

## 9. TS-ONB-05: Home 페이지 개인화

### 9.1 배경

별도 Dashboard 페이지 없이 Home(`/`)이 비로그인/로그인 사용자 공용 랜딩 역할을 하므로, 로그인 + 온보딩 완료 사용자에게는 `purpose` 값에 따라 문구/CTA를 조건부로 보여준다.

### 9.2 구현 가이드

| 항목 | 내용 |
|---|---|
| 파일 | `src/pages/Home.tsx` |
| 조건 | `useAuthStore`의 `user`와 `useProfileStore`의 `profile?.onboardingCompleted`가 모두 true일 때만 개인화 섹션 노출. 비로그인/온보딩 미완료 사용자는 기존 화면 그대로 유지 |
| 매핑(참고: `docs/온보딩_질문_후보.md` 3절) | `check_expected_score` → 상단 히어로 카피를 "예상 레벨 확인" 톤으로 교체 / `improve_speaking` → 강점·개선점 강조 카피 / `realistic_practice` → 실전 모드 안내 강조, "다시 도전하기" CTA 부각 |
| 구현 방식 | `Home.tsx` 상단에 `purpose`별 카피 매핑 객체(`Record<OnboardingPurpose, {title, description}>`)를 두고, 기존 히어로 섹션의 고정 텍스트를 조건부로 교체 |
| 범위 | 이번 v0.1.0에서는 히어로 카피 교체 수준으로 한정하고, `main_problem`/`expected_feature` 기반의 Result 페이지 우선순위 조정(질문 후보 문서 3절의 나머지 매핑)은 별도 TECHSPEC(Interview/Result 개인화)에서 다룬다 |

---

## 10. 데이터 모델 / 타입 추가

`src/types/index.ts`에 추가할 타입(신규 파일 생성 없이 기존 파일에 추가):

| 타입 | 값/필드 | 근거 |
|---|---|---|
| `OnboardingPurpose` | `'check_expected_score' \| 'improve_speaking' \| 'realistic_practice'` | `docs/온보딩_질문_후보.md` 3절 Purpose |
| `OnboardingMainProblem` | `'lack_realistic_practice' \| 'hard_to_self_assess' \| 'no_expert_feedback' \| 'lack_practice_sets'` | 〃 Problem |
| `OnboardingExpectedFeature` | `'goal_al' \| 'goal_ih' \| 'goal_im' \| 'no_goal'` | 〃 Expectation |
| `Profile` | `{ id: string; email: string \| null; onboardingCompleted: boolean; purpose: OnboardingPurpose \| null; mainProblem: OnboardingMainProblem \| null; expectedFeature: OnboardingExpectedFeature \| null }` | `docs/온보딩_profiles_setup.sql`의 `profiles` 컬럼 |

---

## 11. 의존성 검토

새 의존성 추가는 불필요하다.

| 필요 기능 | 검토한 방식 | 결론 |
|---|---|---|
| 멀티스텝 폼 진행 상태 | 폼 라이브러리(예: `react-hook-form`) 검토 | 필드 3개, 각각 단일 선택(라디오형)뿐이라 검증 로직이 단순함 — 로컬 `useState`로 충분, 라이브러리 불필요 |
| 라우팅 가드 | 별도 가드 라이브러리 검토 | `react-router-dom`(v6, 기존 설치됨)의 `navigate()` 호출만으로 조건부 리다이렉트 구현 가능 |
| 온보딩/프로필 전역 상태 | 기존 `zustand`(설치됨) 재사용 | `useAuthStore`와 동일 패턴으로 `useProfileStore` 추가 |
| Supabase 통신 | 기존 `@supabase/supabase-js`(설치됨) 재사용 | `profiles` RLS가 보안 경계를 담당하므로 백엔드 경유 불필요 |

---

## 12. 구현 순서

기술적 의존 관계를 고려한 권장 순서다. 사용자 요청 범위(폼→라우팅→저장→읽기→개인화)와 순서가 다른 부분은 괄호로 이유를 표기했다.

1. **타입 추가** (`src/types/index.ts`) — 이후 모든 단계의 선행 조건
2. **TS-ONB-04 일부: `api/profile.ts`의 `fetchProfile` + `useProfileStore`** (TS-ONB-02 라우팅 분기가 `fetchProfile`을 직접 호출하므로 최소 구현을 먼저 준비)
3. **TS-ONB-01: `Onboarding.tsx` 폼 UI** (저장 연동 전, 로컬 상태만으로 스텝 이동까지 먼저 완성)
4. **TS-ONB-03: `api/profile.ts`의 `saveOnboardingAnswers`** 및 `Onboarding.tsx` 제출 연동
5. **TS-ONB-02: `SignUp.tsx`/`Login.tsx`/`App.tsx` 라우팅 분기 연결**
6. **TS-ONB-04 완성: `useProfileSession` 훅 추가 + `App.tsx`에 연결** (세션 유지 중 자동 갱신)
7. **TS-ONB-05: `Home.tsx` 개인화 섹션**
8. 수동 검증: 신규 가입 → 온보딩 강제 이동 → 답변 저장 → Home 리다이렉트 → 재로그인 시 온보딩 재노출 안 됨 → Home 개인화 문구 확인

---

## 13. 향후 고려사항 (이번 범위 제외)

- 온보딩 미완료 사용자가 URL로 다른 보호 페이지에 직접 접근하는 것을 막는 전역 라우트 가드
- `main_problem`/`expected_feature` 값을 Interview/Result 페이지 우선순위 로직에 반영(`docs/온보딩_질문_후보.md` 3절의 나머지 매핑)
- 온보딩 재응시/수정 UI (마이페이지 등, PRD Phase 2 이후 범위)

---

## 14. 변경 로그

- [2026-08-11] 온보딩 v0.1.0 TECHSPEC 최초 작성 — 멀티스텝 폼, 가입/로그인 후 라우팅, 답변 저장, `profiles` 읽기, Home 개인화 파일 구조 및 구현 순서 정의
