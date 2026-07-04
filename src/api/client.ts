import type { AnalysisResult, QuestionSet } from '@/types'

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return (await response.json()) as T
}

export async function fetchRandomQuestionSet(): Promise<QuestionSet> {
  const response = await fetch('/api/questions/random')
  return parseJsonResponse<QuestionSet>(response)
}

export async function transcribeAudio(audioBlob: Blob): Promise<{ text: string }> {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'answer.webm')

  const response = await fetch('/api/stt', {
    method: 'POST',
    body: formData,
  })
  return parseJsonResponse<{ text: string }>(response)
}

export async function analyzeAnswers(
  topic: string,
  answers: [string, string, string],
): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, answers }),
  })
  return parseJsonResponse<AnalysisResult>(response)
}
