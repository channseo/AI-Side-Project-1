export interface Question {
  id: string
  text: string
}

export interface QuestionSet {
  topic: string
  questions: Question[]
}

export interface AnalysisResult {
  level: string
  strengths: string[]
  improvements: string[]
  repeatedPhrases: string[]
  suggestions: string[]
  sampleAnswer: string
  disclaimer: string
}
