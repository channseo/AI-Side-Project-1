import { useNavigate } from 'react-router-dom'

import { useInterviewStore } from '@/store/useInterviewStore'

export function Result() {
  const navigate = useNavigate()
  const { analysisResult, reset } = useInterviewStore()

  if (!analysisResult) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>분석 결과가 없습니다.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="rounded-full bg-slate-900 px-6 py-3 text-white"
        >
          홈으로
        </button>
      </main>
    )
  }

  function handleRetry() {
    reset()
    navigate('/interview')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-10">
      <section className="rounded-xl bg-slate-900 p-6 text-white">
        <p className="text-sm text-slate-300">예상 OPIC 레벨</p>
        <p className="text-3xl font-bold">{analysisResult.level}</p>
      </section>

      <section>
        <h3 className="mb-2 font-semibold text-slate-900">강점</h3>
        <ul className="list-inside list-disc text-slate-700">
          {analysisResult.strengths.map((strength) => (
            <li key={strength}>{strength}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 font-semibold text-slate-900">개선점</h3>
        <ul className="list-inside list-disc text-slate-700">
          {analysisResult.improvements.map((improvement) => (
            <li key={improvement}>{improvement}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 font-semibold text-slate-900">반복된 표현</h3>
        <ul className="list-inside list-disc text-slate-700">
          {analysisResult.repeatedPhrases.map((phrase) => (
            <li key={phrase}>{phrase}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 font-semibold text-slate-900">추천 표현</h3>
        <ul className="list-inside list-disc text-slate-700">
          {analysisResult.suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 font-semibold text-slate-900">모범 답변</h3>
        <p className="text-slate-700">{analysisResult.sampleAnswer}</p>
      </section>

      <p className="text-xs text-slate-500">{analysisResult.disclaimer}</p>

      <button
        type="button"
        onClick={handleRetry}
        className="rounded-full bg-slate-900 px-6 py-3 font-medium text-white"
      >
        다시 도전하기
      </button>
    </main>
  )
}
