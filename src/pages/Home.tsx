import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">OPIC AI Mock Interview Coach</h1>
      <p className="max-w-md text-slate-600">
        3문제 세트로 실전과 유사한 OPIC 말하기 연습을 하고, AI로부터 예상 레벨과 피드백을
        받아보세요.
      </p>
      <button
        type="button"
        onClick={() => navigate('/interview')}
        className="rounded-full bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-700"
      >
        시작하기
      </button>
    </main>
  )
}
