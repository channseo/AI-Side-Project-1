import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { analyzeAnswers, fetchRandomQuestionSet, transcribeAudio } from '@/api/client'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import { useInterviewStore } from '@/store/useInterviewStore'

export function Interview() {
  const navigate = useNavigate()
  const {
    questionSet,
    currentQuestionIndex,
    answers,
    setQuestionSet,
    setAnswer,
    goToNextQuestion,
    setAnalysisResult,
  } = useInterviewStore()

  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording } =
    useAudioRecorder()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!questionSet) {
      fetchRandomQuestionSet()
        .then(setQuestionSet)
        .catch(() => setErrorMessage('질문을 불러오지 못했습니다. 다시 시도해주세요.'))
    }
  }, [questionSet, setQuestionSet])

  if (!questionSet) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>{errorMessage ?? '질문을 불러오는 중입니다...'}</p>
      </main>
    )
  }

  const { topic, questions } = questionSet
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  async function handleTranscribe() {
    if (!audioBlob) return
    setIsProcessing(true)
    setErrorMessage(null)
    try {
      const { text } = await transcribeAudio(audioBlob)
      setAnswer(currentQuestionIndex, text)
      resetRecording()
    } catch {
      setErrorMessage('음성 변환에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleSubmitForAnalysis() {
    if (answers.length < 3 || answers.some((answer) => !answer)) {
      setErrorMessage('3개 질문에 모두 답변한 뒤 평가할 수 있습니다.')
      return
    }
    setIsProcessing(true)
    setErrorMessage(null)
    try {
      const result = await analyzeAnswers(topic, [answers[0], answers[1], answers[2]])
      setAnalysisResult(result)
      navigate('/result')
    } catch {
      setErrorMessage('AI 분석에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-10">
      <span className="text-sm font-medium text-slate-500">Topic: {topic}</span>
      <h2 className="text-xl font-semibold text-slate-900">
        Q{currentQuestionIndex + 1}. {currentQuestion.text}
      </h2>

      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="rounded-full bg-red-500 px-5 py-2 text-white hover:bg-red-600"
          >
            녹음 시작
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="rounded-full bg-slate-700 px-5 py-2 text-white hover:bg-slate-800"
          >
            녹음 종료
          </button>
        )}
        {audioBlob && !isRecording && (
          <button
            type="button"
            onClick={handleTranscribe}
            disabled={isProcessing}
            className="rounded-full bg-slate-200 px-5 py-2 text-slate-900 hover:bg-slate-300 disabled:opacity-50"
          >
            텍스트로 변환
          </button>
        )}
      </div>

      {answers[currentQuestionIndex] && (
        <p className="rounded-lg bg-slate-100 p-4 text-slate-700">
          {answers[currentQuestionIndex]}
        </p>
      )}

      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <div className="mt-auto flex justify-end gap-3">
        {!isLastQuestion ? (
          <button
            type="button"
            onClick={goToNextQuestion}
            disabled={!answers[currentQuestionIndex]}
            className="rounded-full bg-slate-900 px-6 py-3 font-medium text-white disabled:opacity-50"
          >
            다음 질문
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitForAnalysis}
            disabled={isProcessing}
            className="rounded-full bg-slate-900 px-6 py-3 font-medium text-white disabled:opacity-50"
          >
            평가하기
          </button>
        )}
      </div>
    </main>
  )
}
