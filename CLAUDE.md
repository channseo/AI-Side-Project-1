# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 프로젝트: OPIC AI Mock Interview Coach

OPIC AI Mock Interview Coach — 사용자가 3문제 세트로 OPIC 말하기 시험을 연습하고, 음성을 텍스트로 변환한 뒤, AI 기반 예상 레벨과 피드백을 받는 웹 애플리케이션입니다.

## 기술 스택

- **프론트엔드:** React + TypeScript + Vite
- **상태 관리:** Zustand
- **스타일링:** Tailwind CSS
- **패키지 매니저:** pnpm
- **백엔드:** Node.js + Express
- **데이터베이스:** Supabase (Postgres) — 질문 세트, 답변 텍스트, AI 분석 결과 저장
- **외부 API:** OpenAI Speech-to-Text (Whisper) + GPT 답변 분석

## 코드 스타일

- TypeScript strict 모드 사용, `any` 타입 금지 (불가피하면 `unknown` 사용 후 좁히기)
- default export 대신 named export 사용 (단, 페이지/라우트 컴포넌트는 예외 가능)
- 함수형 컴포넌트와 Hook만 사용, 클래스 컴포넌트 금지
- 컴포넌트 파일명은 PascalCase (`UserCard.tsx`), 그 외 유틸/훅은 camelCase
- 커스텀 훅은 반드시 `use` 접두사로 시작
- import 순서: 외부 라이브러리 → 내부 절대경로 → 상대경로 순으로 정리
- 절대경로 alias 사용 (`@/components/...`), 깊은 상대경로(`../../../`) 금지
- 디버깅용 console.log를 커밋에 남기지 말 것
- 스타일: Tailwind 유틸리티 클래스 우선 사용, 인라인 스타일·커스텀 CSS 최소화

## 명령어

- `pnpm run dev`: 프론트엔드 개발 서버 시작 (Vite)
- `pnpm run build`: 프로덕션 빌드 (`tsc` 타입 체크 후 `vite build`)
- `pnpm run preview`: 빌드 결과물 로컬 미리보기
- `pnpm run lint`: ESLint 검사
- `pnpm run format`: Prettier 포맷팅
- `pnpm run test`: Vitest 실행
- `pnpm start`: 백엔드 Express 서버 실행

환경 변수: `.env` 파일에 `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 필요. 모든 키는 반드시 서버(백엔드) 측에서만 사용하며 클라이언트에 노출 금지.

## 아키텍처

```
src/                   # 프론트엔드 (React + TypeScript)
├── assets/            # 이미지, 폰트 등 정적 리소스
├── components/        # 재사용 가능한 공통 UI 컴포넌트
├── pages/             # 라우트 단위 페이지 컴포넌트 (Home, Interview, Result)
├── hooks/             # 커스텀 훅 (useAudioRecorder 등)
├── store/             # Zustand 전역 상태 관리
├── api/               # API 호출 함수 및 클라이언트 설정
├── types/             # 공유 타입 정의
├── utils/             # 순수 유틸 함수
└── styles/            # 전역 스타일 / 테마

backend/               # 백엔드 (Node.js + Express)
├── server.js          # Express 진입점
├── routes/
│   ├── questions.js   # GET /api/questions/random
│   ├── stt.js         # POST /api/stt
│   └── analyze.js     # POST /api/analyze
└── lib/
    └── supabaseClient.js # Supabase 클라이언트 초기화 (서버 전용, service role key 사용)
```

- 라우팅: React Router v6
- API 통신: 백엔드 Express 서버를 통해 OpenAI API 및 Supabase 호출 (프론트엔드는 Supabase에 직접 접근하지 않음)
- 환경 변수: Vite는 `VITE_` 접두사가 붙은 변수만 클라이언트에 노출됨 (`import.meta.env.VITE_*`). OpenAI API 키와 Supabase service role key는 백엔드 `.env`에서만 관리
- 데이터베이스 테이블 (Supabase)
  - `topics`: 질문 세트 (`topic`, `question_1`, `question_2`, `question_3`)
  - `interview_results`: 인터뷰 세션별 답변 텍스트 + AI 분석 결과 (회원 구분 없이 세션 단위로 저장, `user_id` 없음)

## 중요 사항

- **IMPORTANT: `.env` 파일은 절대 커밋하지 마세요.** `VITE_` 접두사 변수는 빌드 결과물에 그대로 노출되므로 비밀 키를 넣지 말 것
- 새 의존성을 추가하기 전에 먼저 알려주세요 (번들 크기 영향 검토)
- MVP에 인증/로그인 없음 — 사용자 계정 없이 비회원 세션 단위로만 동작
- 답변 텍스트(STT 결과) 및 AI 분석 결과는 Supabase에 저장. 단, **음성 원본 파일은 저장하지 않음** — 브라우저에서 녹음 후 STT 전달, 변환 즉시 폐기
- 분석 결과에 반드시 면책 문구 포함: "본 결과는 AI 기반 추정치이며 실제 OPIC 성적과 차이가 있을 수 있습니다."
- 커밋 전 `pnpm run lint`와 빌드가 통과하는지 확인하세요

## API 엔드포인트

| 메서드 | 경로                    | 설명                                                             |
| ------ | ----------------------- | ---------------------------------------------------------------- |
| GET    | `/api/questions/random` | Supabase `topics` 테이블에서 랜덤 조회, `{ topic, questions: [{id, text}, ...] }` 반환 |
| POST   | `/api/stt`              | `multipart/form-data` 음성 파일 수신, `{ text }` 반환 (음성 파일은 저장하지 않음)      |
| POST   | `/api/analyze`          | `{ topic, answers: [a1, a2, a3] }` 수신, 레벨 + 피드백 JSON 반환 및 Supabase `interview_results`에 결과 저장 |

## 참고 문서

- 프로젝트 기획서는 @OPIC_AI_Mock_Interview_Coach_PRD.md 참고
- 사용 가능한 스크립트는 @package.json 참고
