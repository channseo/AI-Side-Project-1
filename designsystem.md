# OPIC AI Mock Interview Coach — 디자인 시스템

> **참고 자료**: [Speak 브랜드 랜딩 페이지](https://www.speak.com/ko/event/26may-brand/home) (Webflow 실제 배포 CSS 소스코드 분석 기반)
> 아래 색상/폰트/컴포넌트 값은 페이지의 실제 CSS(`speak-website-*.min.css`)에서 추출한 값이며, 추정치가 아닙니다.

---

## 1. 브랜드 톤앤매너 (원본 분석)

Speak 페이지는 **딥 네이비(#00143c) 배경 + 비비드 블루(#1c49ff) 포인트**를 기본으로, 시안-블루-퍼플로 이어지는 **AI 느낌의 그라디언트**를 브랜드 시그니처로 사용합니다. 버튼은 대부분 알약(pill) 형태의 큰 CTA이며, 후기/별점 등 소셜 프루프를 그리드로 강조합니다. 한국어 사용자를 위해 **Pretendard** 가변 폰트를 전용으로 로드하는 점이 특징입니다.

OPIC 앱은 프로모션성 랜딩이 아니라 **집중해서 말하기 연습을 하는 실기 도구**이므로, 원본의 화려한 그라디언트/딥네이비 풀스크린 배경은 지양하고 **비비드 블루를 포인트 컬러로, 밝은 배경을 기본**으로 채택합니다.

---

## 2. 컬러 팔레트

### 2.1 원본 추출 값 (Speak.com 실제 CSS 변수)

| 이름                      | HEX                                                               | 비고                     |
| ------------------------- | ----------------------------------------------------------------- | ------------------------ |
| slate-blue (Primary)      | `#1c49ff`                                                         | 버튼/카드/CTA 메인 컬러  |
| hover blue                | `#6a88ff`                                                         | 버튼 hover 상태          |
| dark navy (섹션 배경)     | `#00143c`                                                         | 스티키 카드 섹션 배경    |
| dark-blue (헤딩 텍스트)   | `#12205a`                                                         | 밝은 배경 위 제목 텍스트 |
| white-smoke               | `#f3f3f3`, `#ececec`                                              | 서브 배경                |
| tab 비활성 배경           | `#f3f3f5`, `#e0e6eb`                                              | 탭/토글 컨테이너         |
| light blue tint           | `#dbe2ff`, `#e2f0ff`                                              | 배지/하이라이트 배경     |
| grey / silver             | `#9e9e9e`, `#c5c5c5`                                              | 보조 텍스트              |
| aquamarine (성공)         | `#29c195`                                                         | 긍정 지표                |
| gold / khaki              | `#f9cb78`, `#fff175`                                              | 중간 등급 강조           |
| tomato / red (경고)       | `#ff4242`, `#c51818`                                              | 오류/녹음중 표시         |
| divider                   | `rgba(0,0,0,0.15)`                                                | 구분선 (`#00000026`)     |
| footer link (반투명 흰색) | `rgba(255,255,255,0.5)`                                           | 저채도 텍스트            |
| 시그니처 그라디언트       | `linear-gradient(315deg,#4fffff,#0094ff 36%,#2848f5 71%,#8b61fd)` | AI 느낌 강조 요소        |

### 2.2 OPIC 프로젝트 적용 토큰 (Tailwind 매핑)

원본 팔레트를 학습 도구에 맞게 재구성한 시맨틱 토큰입니다.

| 토큰                         | HEX                                                               | 용도                                        |
| ---------------------------- | ----------------------------------------------------------------- | ------------------------------------------- |
| `primary`                    | `#1c49ff`                                                         | 메인 CTA, 활성 탭, 링크, 포커스 링          |
| `primary-hover`              | `#6a88ff`                                                         | 버튼 hover/active                           |
| `primary-light`              | `#dbe2ff`                                                         | 배지/카드 배경, 선택된 상태                 |
| `surface`                    | `#ffffff`                                                         | 카드/패널 배경                              |
| `background`                 | `#f8f9fa`                                                         | 페이지 배경                                 |
| `border`                     | `#e0e6eb`                                                         | 카드 테두리, 구분선                         |
| `text-primary`               | `#121212`                                                         | 본문/제목                                   |
| `text-secondary`             | `#666666`(`#9e9e9e`)                                              | 설명, 캡션                                  |
| `success` (IH/AL)            | `#29c195`                                                         | 상위 레벨 배지                              |
| `warning` (IM)               | `#f9cb78`                                                         | 중위 레벨 배지                              |
| `danger` (녹음중 표시, 오류) | `#ff4242`                                                         | 녹음 상태 인디케이터, 에러 메시지           |
| `accent-gradient`            | `linear-gradient(315deg,#4fffff,#0094ff 36%,#2848f5 71%,#8b61fd)` | "AI 분석중" 로딩, 최상위(AL) 레벨 강조 배지 |

> `danger`(#ff4242)는 원본에서 프로모션 배지 색이었지만, 이 앱에서는 **녹음 중 표시(REC)** 와 **에러/재시도 안내**에 재사용하는 것을 권장합니다.

---

## 3. 타이포그래피

- **폰트 패밀리**: `Pretendard, sans-serif` — 한글 가변 폰트, Speak 페이지가 실제 로드하는 값과 동일 (`@import` 또는 `pretendard` npm 패키지로 프로젝트에 도입 권장)
- fallback: `system-ui, -apple-system, sans-serif`

| 용도                           | 크기 (Desktop / Mobile) | Weight          | line-height |
| ------------------------------ | ----------------------- | --------------- | ----------- |
| 페이지 타이틀 (H1)             | 32px / 28px             | 700             | 1.2         |
| 섹션 타이틀 (H2)               | 24px / 20px             | 700             | 1.2         |
| 버튼 텍스트                    | 22px / 18px             | 700             | 1.2         |
| 본문                           | 16px                    | 500             | 1.5         |
| 캡션 / 안내문구 (면책 문구 등) | 14px                    | 400             | 1.4         |
| 보조 설명 (카드 서브텍스트)    | 20px / 18px             | 700, opacity .5 | 1.2         |

---

## 4. Spacing · Radius · Shadow

| 구분            | 값                                         | 사용처                       |
| --------------- | ------------------------------------------ | ---------------------------- |
| Radius `sm`     | 8px                                        | input, chip, 작은 배지       |
| Radius `md`     | 12–16px                                    | 버튼, 탭 아이템              |
| Radius `lg`     | 20–24px                                    | 카드, 패널, 모달             |
| Radius `full`   | 48px / 100px                               | 알약형 CTA 버튼, 플로팅 네비 |
| Shadow `card`   | `0 2px 20px rgba(0,0,0,0.05)`              | 카드, 드롭다운               |
| Section padding | 80px 20px (Desktop), 40–60px 20px (Mobile) | 페이지 섹션 간격             |
| Grid gap        | 16–24px                                    | 카드 그리드, 리스트          |
| Divider         | 1px, `rgba(0,0,0,0.15)`                    | 리스트/섹션 구분선           |

---

## 5. 컴포넌트 가이드

### 5.1 버튼

- **Primary (알약형 CTA)**: bg `primary`, 텍스트 흰색/700, `radius-full`, height 56–65px, padding 좌우 32px → "시작하기", "평가하기", "다음 질문"
  - hover: bg `primary-hover`
- **Secondary/Outline**: 투명 배경, `border 2px solid primary`, 텍스트 `primary` → "다시 녹음하기"
- **Danger (녹음 중지)**: bg `danger`, 흰색 텍스트 → 녹음 종료 버튼

### 5.2 카드

- 질문/토픽 카드: `surface` 배경, `radius-lg`(20–24px), `shadow-card`, 내부 padding 24px
- 결과 레벨 카드: `primary` 또는 `accent-gradient` 배경, 흰색 텍스트, 중앙 정렬, `radius-lg`

### 5.3 레벨 배지

- 등급별 색상 매핑: `AL` → `accent-gradient`, `IH` → `success`, `IM1~3` → `warning`, `NH/NM/NL` → `text-secondary` 배경
- 모양: `radius-full`, padding 6px 16px, bold 텍스트

### 5.4 탭/토글 (질문 1·2·3 네비게이션)

- 컨테이너: bg `border`(`#e0e6eb`), `radius-lg`(20px), padding 12px
- 비활성 탭: bg `#f3f3f5`
- 활성 탭: bg `surface` + `shadow-card`

### 5.5 구분선 & 면책 문구 박스

- 구분선: 1px `rgba(0,0,0,0.15)`, margin 24px
- 면책 문구("본 결과는 AI 기반 추정치이며...") 박스: bg `#f3f3f3`, 텍스트 `text-secondary` 14px, radius `sm`, padding 12–16px — Result 페이지 하단 고정 배치

### 5.6 녹음 상태 인디케이터

- 녹음 중: `danger` 색 점 + pulse 애니메이션, "REC" 텍스트
- 대기 중: `text-secondary` 아웃라인 아이콘

---

## 6. Tailwind 적용 예시 (`tailwind.config.ts` 참고용)

```ts
export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1c49ff', hover: '#6a88ff', light: '#dbe2ff' },
        surface: '#ffffff',
        background: '#f8f9fa',
        border: '#e0e6eb',
        success: '#29c195',
        warning: '#f9cb78',
        danger: '#ff4242',
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 2px 20px rgba(0,0,0,0.05)',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

## 7. 페이지별 적용 가이드

- **Home**: 밝은 `background` 위 중앙 정렬 히어로, `primary` 알약 버튼 "시작하기" 1개 강조
- **Interview**: 상단 질문 탭(1/2/3), 중앙 질문 카드, 하단 고정(floating) 녹음/다음 버튼, 녹음 중엔 `danger` 인디케이터
- **Result**: 상단 레벨 배지(등급별 색상), 강점/개선점 리스트(카드형), 하단 면책 문구 박스 고정 노출

---

## 8. 접근성 참고

- `primary`(#1c49ff) on 흰색 배경 대비율 4.5:1 이상 확보됨 — 본문 텍스트에 안전하게 사용 가능
- `text-secondary`(#9e9e9e)는 큰 텍스트(18px+, bold)에만 사용, 본문 대비율 부족 주의
