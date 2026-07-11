s# OPIC AI Mock Interview Coach

## 1. Product Vision

OPIC AI Mock Interview Coach는 OPIC 수험생이 실제 시험과 유사한 3문제 mock interview를 통해 음성 답변을 실습하고, AI 분석을 통해 예상 OPIC 레벨과 피드백을 받는 웹 서비스입니다. 단순 문법 교정이 아니라 시험 환경에 가까운 연습 경험과 답변 구성 역량 강화를 제공합니다.

## 2. Problem Statement

OPIC 학습자는 다음과 같은 문제를 겪고 있습니다.

- 실제 시험처럼 말하기 연습하기 어렵다.
- 자신의 답변 수준을 객관적으로 평가하기 어렵다.
- 예상 OPIC 레벨을 파악하기 어렵다.
- 답변 간 일관성과 스토리텔링 능력을 평가받기 어렵다.
- 전문 강사의 피드백을 받기 어렵다.
- 질문 세트로 반복 연습하기 어렵다.

## 3. Product Goals

- 실제 시험과 유사한 3개 질문 세트 기반 mock interview 제공.
- 음성 녹음 → STT 변환 → AI 분석 흐름을 매끄럽게 구현.
- 답변 길이, 문장 다양성, 시제 활용, 논리 흐름 등 종합 평가.
- 예상 OPIC 레벨 및 강점/개선점 제공.
- 사용자에게 명확한 연습 루프와 개선 방향 제시.

## 4. Success Metrics

- 사용자 세션 당 mock interview 완료율.
- 결과 페이지 조회 비율.
- AI 분석 후 재시도/재실행 의향 비율.
- 피드백 만족도.
- STT+AI 응답 시간.
- 오류 발생률 및 API 실패율.

## 5. User Persona

1. OPIC IM 이상 목표 수험생
   - 직무 영어 면접 준비, 승진 대비
   - 시간 대비 효율적인 말하기 연습 필요
2. 취업 준비생
   - 영어 말하기 준비 중 실전 감각 필요
3. 승진 준비 직장인
   - 제한된 시간 내에 실전형 피드백 필요
4. 영어 말하기 시험 준비생
   - 스피킹 실전 연습과 자체 평가 필요

## 6. User Journey

1. 홈에서 서비스 소개 확인
2. 시작하기 클릭
3. 랜덤 토픽과 3문제 세트 안내
4. 질문 1 녹음 → 종료
5. 질문 2 녹음 → 종료
6. 질문 3 녹음 → 종료
7. 평가하기 클릭
8. STT 변환 + AI 분석 실행
9. 결과 페이지 확인
10. 강점/개선점 확인 후 재도전

## 7. User Stories

- 사용자는 버튼 클릭으로 랜덤 Topic과 3문제를 받을 수 있어야 한다.
- 사용자는 각 질문을 음성으로 녹음할 수 있어야 한다.
- 사용자는 녹음한 음성을 텍스트로 변환된 결과로 확인할 수 있어야 한다.
- 사용자는 AI 분석 결과에서 예상 OPIC 레벨을 볼 수 있어야 한다.
- 사용자는 강점, 개선점, 추천 표현, 모범 답변을 받을 수 있어야 한다.
- 사용자는 "본 결과는 AI 기반 추정치이며 실제 OPIC 성적과 차이가 있을 수 있습니다." 문구를 확인할 수 있어야 한다.

## 8. Functional Requirements

- 랜덤 Topic 선택 엔진
- Topic별 3개 질문 세트 랜더링
- 브라우저 음성 녹음 기능
- OpenAI Speech-to-Text API 또는 Whisper API 호출
- STT 결과 텍스트 확인 UI
- OpenAI GPT 기반 답변 분석
- 예상 OPIC 레벨 추정 로직
- 결과 페이지 구성
- 오류/예외 처리
- Supabase 기반 질문 세트 조회 및 답변/분석 결과 저장

## 9. Non-Functional Requirements

- 응답 속도: STT + AI 분석 전체 응답 10초 이내 목표
- 가용성: 99% 이상
- 확장성: Supabase 테이블 기반으로 Question DB 및 답변 기록 확장 용이
- 보안: OpenAI API 키 및 Supabase service role key 백엔드 보관, 사용자 음성 원본 비저장 (답변 텍스트/분석 결과만 저장)
- 접근성: 기본적인 웹 접근성 준수
- 브라우저 호환성: 최신 Chrome/Edge/Firefox 지원

## 10. User Flow Diagram

1. Home Page
   - 시작하기
2. Interview Page
   - Topic / Question 1 표시
   - 녹음 시작/중지
   - 다음 질문
3. 질문 2, 질문 3 반복
4. 평가하기
   - STT 요청
   - AI 분석 요청
5. Result Page
   - 예상 레벨
   - 강점 / 개선점
   - 추천 표현 / 모범 답변
   - 레벨 정책 문구

## 11. Screen Wireframes

- Home
  - 서비스 제목, 설명, 시작하기 버튼
- Interview Page
  - 토픽 카드
  - 질문 텍스트
  - 녹음 버튼 / 상태 표시
  - 텍스트 변환 결과 영역
  - 다음 질문 버튼
  - 평가하기 버튼
- Result Page
  - 예상 OPIC 레벨 카드
  - 강점 목록
  - 개선점 목록
  - 반복 표현 영역
  - 추천 표현 영역
  - 모범 답변 예시
  - 레벨 정책 안내 문구

## 12. System Architecture

- Frontend: React + TypeScript + Vite (Tailwind CSS, Zustand)
- Backend: Node.js + Express
- 패키지 매니저: pnpm
- OpenAI API:
  - Speech-to-Text
  - GPT 모델 분석
- Database: Supabase (Postgres)
  - `topics`: 질문 세트
  - `interview_results`: 답변 텍스트 + AI 분석 결과 (비회원 세션 단위)
- 데이터 흐름:
  - 사용자 음성 → 브라우저 녹음
  - 음성 파일 → 백엔드 → OpenAI STT (변환 후 즉시 폐기, 저장 안 함)
  - 텍스트 결과 → GPT 분석 프롬프트
  - 분석 결과 → Supabase `interview_results`에 저장
  - 분석 결과 → 프론트엔드

## 13. API Design

- `GET /api/questions/random`
  - 설명: 랜덤 Topic + 3문제 세트 반환
  - 응답: `{ topic, questions: [{id, text}, ...] }`
- `POST /api/stt`
  - 설명: 음성 파일 업로드 후 텍스트 변환
  - 요청: `multipart/form-data` `audio`
  - 응답: `{ text }`
- `POST /api/analyze`
  - 설명: 3개 답변 텍스트 분석 및 레벨/피드백 반환, 결과를 Supabase `interview_results`에 저장
  - 요청: `{ topic, answers: [a1, a2, a3] }`
  - 응답: `{ id, level, strengths, improvements, repeatedPhrases, suggestions, sampleAnswer, disclaimer }`

## 14. Database Structure

Supabase (Postgres) 테이블 구조.

- `topics` (질문 세트)
  | 컬럼 | 타입 | 설명 |
  |---|---|---|
  | `id` | uuid, PK, default `gen_random_uuid()` | 고유 ID |
  | `topic` | text | 토픽명 (예: "Park") |
  | `question_1` | text | 질문 1 |
  | `question_2` | text | 질문 2 |
  | `question_3` | text | 질문 3 |
  | `created_at` | timestamptz, default `now()` | 생성 시각 |

- `interview_results` (세션별 답변 + AI 분석 결과, 비회원 — `user_id` 없음)
  | 컬럼 | 타입 | 설명 |
  |---|---|---|
  | `id` | uuid, PK, default `gen_random_uuid()` | 세션 ID |
  | `topic_id` | uuid, FK → `topics.id` | 참조 토픽 |
  | `answer_1` / `answer_2` / `answer_3` | text | STT 변환된 답변 텍스트 |
  | `level` | text | 예상 OPIC 레벨 |
  | `strengths` | jsonb | 강점 목록 |
  | `improvements` | jsonb | 개선점 목록 |
  | `repeated_phrases` | jsonb | 반복 표현 목록 |
  | `suggestions` | jsonb | 추천 표현 목록 |
  | `sample_answer` | text | 모범 답변 |
  | `created_at` | timestamptz, default `now()` | 생성 시각 |

- 향후 확장용 컬럼: `category`, `difficulty` (topics), `duration_seconds` (interview_results)
- 음성 원본 파일은 어떤 테이블에도 저장하지 않음 (Supabase Storage 미사용)

## 15. OpenAI Prompt Design

- STT: OpenAI Speech-to-Text API 사용
- 분석 프롬프트 예시:
  ```text
  You are an English-speaking OPIC mock interview evaluator.
  Topic: {topic}
  Q1: {question1}
  A1: {answer1}
  Q2: {question2}
  A2: {answer2}
  Q3: {question3}
  A3: {answer3}

  Evaluate the answers by:
  - 예상 OPIC 레벨(IM1, IM2, IM3, IH, AL)
  - 답변 길이
  - 문장 다양성
  - 시제 활용
  - 논리적 흐름
  - 질문 간 연결성
  - 표현 반복 여부
  - 스토리텔링

  Return JSON:
  {
    "level": "...",
    "strengths": ["...", "..."],
    "improvements": ["...", "..."],
    "repeatedPhrases": ["...", "..."],
    "suggestions": ["...", "..."],
    "sampleAnswer": "..."
  }
  ```
- 필수 안내 문구:
  - "본 결과는 AI 기반 추정치이며 실제 OPIC 성적과 차이가 있을 수 있습니다."

## 16. Error Handling Strategy

- 클라이언트
  - 녹음 권한 거부 시 안내 메시지
  - 네트워크 오류 시 재시도 제안
  - STT/분석 오류 시 사용자 친화적 메시지
- 백엔드
  - OpenAI API 오류 로그 및 5xx 응답
  - 입력 검증: 음성 파일, 질문 및 답변 유효성
  - 타임아웃 설정
- 공통
  - 실패 시 단계별 복구 유도
  - “다시 시도” 버튼 제공
  - 서비스 이용 불가 시 기본 텍스트 피드백 안내

## 17. MVP Scope

포함

- 랜덤 Topic 선택
- 3문제 세트 제공
- 브라우저 음성 녹음
- OpenAI Speech-to-Text 변환
- 변환 텍스트 확인
- OpenAI 분석 기반 예상 OPIC 레벨
- 강점/개선점/추천 표현/모범 답변 출력
- 레벨 정책 문구 표시
- 답변 텍스트 및 AI 분석 결과 Supabase 저장 (비회원 세션 단위)

제외

- 회원가입/로그인
- 사용자 프로필
- 사용자별 기록 조회/마이페이지 (저장은 하되 조회 UI는 제외)
- 통계 대시보드
- 발음/억양/속도 분석
- 결제 및 관리자 기능

## 18. Future Roadmap

- Phase 1: MVP 출시
  - 기본 인터뷰, STT, AI 분석, 결과 제공, Supabase 저장
- Phase 2: 사용자 경험 개선
  - 기록 조회/마이페이지, 복습 모드
  - 복습 모드, 분야별 Topic 필터
  - 사용자 피드백 루프
- Phase 3: 심화 평가
  - 발음/억양/속도 분석
  - 학습 통계 및 진단 리포트
- Phase 4: 커뮤니티/강사 연계
  - 실시간 모의 인터뷰
  - 강사 피드백 연동
- Phase 5: 글로벌 확장
  - 다른 말하기 시험(Speaking Test) 확장
  - 멀티랭귀지 지원

## 추가 개발 지원 내용

### 프로젝트 폴더 구조

- `src/` (프론트엔드 — React + TypeScript)
  - `assets/` — 이미지, 폰트 등 정적 리소스
  - `components/` — 재사용 가능한 공통 UI 컴포넌트
  - `pages/` — 라우트 단위 페이지 컴포넌트 (Home, Interview, Result)
  - `hooks/` — 커스텀 훅 (useAudioRecorder 등)
  - `store/` — Zustand 전역 상태 관리
  - `api/` — API 호출 함수 및 클라이언트 설정
  - `types/` — 공유 타입 정의
  - `utils/` — 순수 유틸 함수
  - `styles/` — 전역 스타일 / 테마
- `backend/`
  - `server.js`
  - `routes/`
    - `questions.js`
    - `stt.js`
    - `analyze.js`
  - `lib/`
    - `supabaseClient.js`
- `.env`
- `package.json`
- `README.md`

### 개발 단계별 Task List

1. 프로젝트 초기 설정
   - React + TypeScript + Vite 프론트엔드 구성 (Tailwind CSS, Zustand)
   - Node.js + Express 백엔드 구성
   - Supabase 프로젝트 생성 및 `topics`, `interview_results` 테이블 생성
2. 질문 시드 데이터 입력 및 랜덤 질문 API 구현 (Supabase 조회)
3. 브라우저 녹음 UI 구현
4. STT 엔드포인트 연결
5. AI 분석 엔드포인트 연결 및 결과 Supabase 저장
6. 결과 페이지 UI 구현
7. 오류 처리 및 사용자 안내 추가
8. 테스트 및 MVP 검증

### 우선순위별 구현 계획

1순위

- Supabase 테이블 설계 및 연동
- 랜덤 Topic + Question Set
- 음성 녹음 (브라우저에서만 처리, 파일 미저장)
- STT 요청 및 텍스트 확인
- AI 분석 결과 출력 및 Supabase 저장
  2순위
- 상세 결과 화면
- 오류/재시도 UX
- 결과 페이지 디자인 개선
  3순위
- 질문 DB 확장
- 추가 평가 항목
- 기록 조회 UI (마이페이지)

### API 명세서

- `GET /api/questions/random`
- `POST /api/stt`
- `POST /api/analyze`

### 질문 시드 데이터 예시 (Supabase `topics` 테이블 삽입용)

```sql
insert into topics (topic, question_1, question_2, question_3) values
('Park', 'Tell me about a park you often visit.', 'What do you usually do there?', 'Describe a memorable experience you had there.'),
('Cafe', 'Describe your favorite cafe.', 'What do you usually order there?', 'Who do you usually go with and why?');
```

### OpenAI 프롬프트 예시

```text
You are an experienced OPIC evaluator. Evaluate the following candidate responses.
Topic: Park
Q1: Tell me about a park you often visit.
A1: {answer1}
Q2: What do you usually do there?
A2: {answer2}
Q3: Describe a memorable experience you had there.
A3: {answer3}

Please provide:
- 예상 OPIC 레벨 (IM1, IM2, IM3, IH, AL)
- Strengths
- Improvements
- Repeated phrases
- Suggestions
- A sample model answer summary

Return only valid JSON.
```

### MVP 개발 체크리스트

- [x] 랜덤 Topic 제공
- [x] 3개 질문 UI
- [x] 음성 녹음 기능
- [x] STT 변환 API 연결
- [x] 변환된 텍스트 확인 UI
- [x] AI 분석 API 연결
- [x] 예상 OPIC 레벨 출력
- [x] 강점/개선점/추천 표현/모범 답변 출력
- [x] 레벨 정책 문구 표시

### Copilot용 개발 프롬프트

```
You are a developer building OPIC AI Mock Interview Coach.
Create a Node.js + Express backend with these endpoints: GET /api/questions/random, POST /api/stt, POST /api/analyze.
Create a React + TypeScript + Vite frontend with Tailwind CSS and Zustand that handles 3-question interview flow, records audio, sends it to /api/stt, and displays analysis results from /api/analyze.
Use Supabase (Postgres) for question data (`topics` table) and to persist answer text + AI analysis results (`interview_results` table). Do not store raw audio files. Keep implementation minimal for MVP.
```
