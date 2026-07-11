import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useInView } from '@/hooks/useInView'

const steps = [
  {
    label: '01',
    title: '질문 3세트 받기',
    description: '자신이 원하는 주제로 구성된 콤보 질문 3개를 무작위로 받아요.',
  },
  {
    label: '02',
    title: '말하고 녹음하기',
    description: '브라우저에서 바로 녹음하고, 음성은 텍스트로만 변환 후 즉시 폐기돼요.',
  },
  {
    label: '03',
    title: 'AI 레벨 & 피드백',
    description: '답변을 분석해 예상 레벨과 강점·개선점을 구체적으로 알려드려요.',
  },
]

const levelBadges = [
  { label: 'AL', className: 'bg-accent-gradient text-white' },
  { label: 'IH', className: 'bg-success text-white' },
  { label: 'IM1~3', className: 'bg-warning text-ink' },
  { label: 'NH', className: 'bg-ink-muted text-white' },
]

const faqs = [
  {
    question: '로그인이 꼭 필요한가요?',
    answer: '아니요. 회원가입/로그인 없이 바로 연습을 시작할 수 있어요.',
  },
  {
    question: '녹음한 음성이 저장되나요?',
    answer: '아니요. 음성은 텍스트 변환에만 사용되고, 변환 즉시 폐기되며 저장하지 않아요.',
  },
  {
    question: '몇 문제를 연습하나요?',
    answer: '한 세션에 3문제(콤보 질문)를 연습해요.',
  },
  {
    question: '결과가 실제 OPIC 성적과 같나요?',
    answer: 'AI 기반 추정치로, 실제 OPIC 성적과 차이가 있을 수 있어요.',
  },
]

export function Home() {
  const navigate = useNavigate()
  const { ref: stepsRef, isInView: stepsInView } = useInView<HTMLDivElement>(0.3)
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set())

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <section className="flex flex-col items-center gap-6 px-5 py-20 text-center md:py-24">
        <span className="rounded-full bg-primary-light px-4 py-1.5 text-sm font-bold text-primary">
          AI 기반 OPIC 스피킹 코치
        </span>
        <h1 className="max-w-2xl text-[28px] font-bold leading-tight text-ink md:text-[32px]">
          3문제로 끝내는
          <br />
          실전 같은 OPIC 말하기 연습
        </h1>
        <p className="max-w-md text-base font-medium leading-relaxed text-ink-secondary">
          질문을 듣고 답변을 녹음하면, AI가 예상 레벨과 피드백을 알려드려요. 로그인 없이 바로
          시작할 수 있어요.
        </p>
        <button
          type="button"
          onClick={() => navigate('/interview')}
          className="rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-card transition hover:bg-primary-hover"
        >
          무료로 시작하기
        </button>
      </section>

      <section className="px-5 py-16 md:py-20">
        <h2 className="mb-10 text-center text-xl font-bold text-ink md:text-2xl">
          이렇게 진행돼요
        </h2>
        <div ref={stepsRef} className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.label}
              style={{ transitionDelay: stepsInView ? `${index * 150}ms` : '0ms' }}
              className={`rounded-lg bg-surface p-6 text-left shadow-card transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:delay-0 ${
                stepsInView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              <span className="text-sm font-bold text-primary">{step.label}</span>
              <h3 className="mt-2 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-ink-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 md:py-20">
        <h2 className="mb-8 text-center text-xl font-bold text-ink md:text-2xl">
          답변 후 예상 레벨을 확인하세요
        </h2>
        <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-3">
          {levelBadges.map((badge) => (
            <span
              key={badge.label}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${badge.className}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-5 bg-primary px-5 py-16 text-center md:py-20">
        <h2 className="text-xl font-bold text-white md:text-2xl">
          지금 바로 실전처럼 연습해보세요
        </h2>
        <button
          type="button"
          onClick={() => navigate('/interview')}
          className="rounded-full bg-white px-8 py-4 text-lg font-bold text-primary shadow-card transition hover:bg-primary-light"
        >
          시작하기
        </button>
      </section>

      <section className="px-5 py-16 md:py-20">
        <h2 className="mb-8 text-center text-xl font-bold text-ink md:text-2xl">
          자주 묻는 질문
        </h2>
        <div className="mx-auto flex max-w-2xl flex-col divide-y divide-[rgba(0,0,0,0.15)] overflow-hidden rounded-lg bg-surface shadow-card">
          {faqs.map((faq, index) => {
            const isOpen = openFaqs.has(index)
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-bold text-ink">{faq.question}</span>
                  <span className="shrink-0 text-xl font-bold text-primary">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-5 text-sm font-medium leading-relaxed text-ink-secondary">
                    {faq.answer}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <footer className="flex flex-col items-center gap-4 px-5 py-10">
        <p className="max-w-lg rounded-sm bg-[#f3f3f3] px-4 py-3 text-center text-sm text-ink-secondary">
          본 결과는 AI 기반 추정치이며 실제 OPIC 성적과 차이가 있을 수 있습니다.
        </p>
        <p className="text-xs text-ink-muted">OPIC AI Mock Interview Coach</p>
      </footer>
    </main>
  )
}
