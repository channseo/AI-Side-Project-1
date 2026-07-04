import { create } from 'zustand'

import type { AnalysisResult, QuestionSet } from '@/types'

interface InterviewState {
  questionSet: QuestionSet | null
  currentQuestionIndex: number
  answers: string[]
  analysisResult: AnalysisResult | null
  setQuestionSet: (questionSet: QuestionSet) => void
  setAnswer: (index: number, text: string) => void
  goToNextQuestion: () => void
  setAnalysisResult: (result: AnalysisResult) => void
  reset: () => void
}

const initialState = {
  questionSet: null,
  currentQuestionIndex: 0,
  answers: [] as string[],
  analysisResult: null,
}

export const useInterviewStore = create<InterviewState>((set) => ({
  ...initialState,
  setQuestionSet: (questionSet) =>
    set({ questionSet, currentQuestionIndex: 0, answers: [], analysisResult: null }),
  setAnswer: (index, text) =>
    set((state) => {
      const answers = [...state.answers]
      answers[index] = text
      return { answers }
    }),
  goToNextQuestion: () =>
    set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
  setAnalysisResult: (analysisResult) => set({ analysisResult }),
  reset: () => set(initialState),
}))
