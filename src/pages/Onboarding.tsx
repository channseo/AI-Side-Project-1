import { useState } from 'react'

import { Navigate, useNavigate } from 'react-router-dom'

import { saveOnboardingAnswers } from '@/api/onboarding'
import { LoadingScreen } from '@/components/LoadingScreen'
import { useAuthStore } from '@/store/useAuthStore'
import { useProfileStore } from '@/store/useProfileStore'

import type {
  OnboardingExpectedFeature,
  OnboardingMainProblem,
  OnboardingPurpose,
} from '@/types'

interface OnboardingAnswers {
  purpose: OnboardingPurpose | null
  mainProblem: OnboardingMainProblem | null
  expectedFeature: OnboardingExpectedFeature | null
}

interface StepOption<T extends string> {
  label: string
  value: T
}

const purposeOptions: StepOption<OnboardingPurpose>[] = [
  { label: '예상 오픽 레벨/성적 확인', value: 'check_expected_score' },
  { label: '말하기 실력 향상 (강점·개선점 피드백)', value: 'improve_speaking' },
  { label: '실전과 비슷한 환경에서 연습', value: 'realistic_practice' },
]

const mainProblemOptions: StepOption<OnboardingMainProblem>[] = [
  { label: '실전처럼 연습할 곳이 없음', value: 'lack_realistic_practice' },
  { label: '내 답변 수준을 스스로 판단하기 어려움', value: 'hard_to_self_assess' },
  { label: '전문 강사 피드백을 받기 어려움', value: 'no_expert_feedback' },
  { label: '반복 연습할 질문 세트가 부족함', value: 'lack_practice_sets' },
]

const expectedFeatureOptions: StepOption<OnboardingExpectedFeature>[] = [
  { label: 'AL', value: 'goal_al' },
  { label: 'IH', value: 'goal_ih' },
  { label: 'IM1 ~ IM3', value: 'goal_im' },
  { label: '아직 목표 없음', value: 'no_goal' },
]

const TOTAL_STEPS = 3

const initialAnswers: OnboardingAnswers = {
  purpose: null,
  mainProblem: null,
  expectedFeature: null,
}

interface OnboardingStepCardProps<T extends string> {
  question: string
  options: StepOption<T>[]
  selectedValue: T | null
  onSelect: (value: T) => void
}

function OnboardingStepCard<T extends string>({
  question,
  options,
  selectedValue,
  onSelect,
}: OnboardingStepCardProps<T>) {
  return (
    <div className="w-full rounded-lg bg-surface p-6 shadow-card">
      <h2 className="text-lg font-bold leading-tight text-ink md:text-xl">{question}</h2>
      <div className="mt-6 flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = option.value === selectedValue
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              aria-pressed={isSelected}
              className={`rounded-md border-2 px-5 py-4 text-left text-base font-bold transition ${
                isSelected
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-border bg-surface text-ink hover:border-primary'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Onboarding() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const profile = useProfileStore((state) => state.profile)
  const profileStatus = useProfileStore((state) => state.status)
  const setProfile = useProfileStore((state) => state.setProfile)

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialAnswers)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  if (profileStatus === 'idle' || profileStatus === 'loading') {
    return <LoadingScreen />
  }

  if (profileStatus === 'error') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5">
        <p className="text-sm font-medium text-ink-secondary">
          프로필 정보를 불러오지 못했어요. 새로고침 후 다시 시도해주세요.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-full bg-primary px-6 py-3 text-base font-bold text-white shadow-card transition hover:bg-primary-hover"
        >
          새로고침
        </button>
      </main>
    )
  }

  if (profile?.onboarding_completed) {
    return <Navigate to="/dashboard" replace />
  }

  const isLastStep = currentStep === TOTAL_STEPS - 1

  const isCurrentStepAnswered =
    (currentStep === 0 && answers.purpose !== null) ||
    (currentStep === 1 && answers.mainProblem !== null) ||
    (currentStep === 2 && answers.expectedFeature !== null)

  const isAllAnswered =
    answers.purpose !== null && answers.mainProblem !== null && answers.expectedFeature !== null

  const handlePrev = () => {
    setSaveError(null)
    setCurrentStep((step) => Math.max(0, step - 1))
  }

  const handleNext = () => {
    setCurrentStep((step) => Math.min(TOTAL_STEPS - 1, step + 1))
  }

  const handleComplete = async () => {
    if (isSaving || !user) return

    const { purpose, mainProblem, expectedFeature } = answers
    if (!purpose || !mainProblem || !expectedFeature) return

    setIsSaving(true)
    setSaveError(null)

    try {
      const updatedProfile = await saveOnboardingAnswers(user.id, {
        purpose,
        mainProblem,
        expectedFeature,
      })
      setProfile(updatedProfile)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      setSaveError('답변을 저장하지 못했어요. 잠시 후 다시 시도해주세요.')
      setIsSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-16">
      <div className="flex w-full max-w-md flex-col items-center">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="text-sm font-bold text-primary">
            {currentStep + 1}/{TOTAL_STEPS}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-10 rounded-full ${
                  index <= currentStep ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {currentStep === 0 && (
          <OnboardingStepCard
            question="이 서비스에서 가장 기대하는 것은 무엇인가요?"
            options={purposeOptions}
            selectedValue={answers.purpose}
            onSelect={(value) => setAnswers((prev) => ({ ...prev, purpose: value }))}
          />
        )}
        {currentStep === 1 && (
          <OnboardingStepCard
            question="말하기 연습에서 가장 어려움을 느끼는 부분은 무엇인가요?"
            options={mainProblemOptions}
            selectedValue={answers.mainProblem}
            onSelect={(value) => setAnswers((prev) => ({ ...prev, mainProblem: value }))}
          />
        )}
        {currentStep === 2 && (
          <OnboardingStepCard
            question="목표로 하는 오픽 성적이 있으신가요?"
            options={expectedFeatureOptions}
            selectedValue={answers.expectedFeature}
            onSelect={(value) => setAnswers((prev) => ({ ...prev, expectedFeature: value }))}
          />
        )}

        <div className="mt-8 flex w-full items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="rounded-full border-2 border-primary px-6 py-3 text-base font-bold text-primary transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            이전
          </button>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleComplete}
              disabled={!isAllAnswered || isSaving}
              className="rounded-full bg-primary px-8 py-3 text-base font-bold text-white shadow-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? '저장 중...' : '완료'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentStepAnswered}
              className="rounded-full bg-primary px-8 py-3 text-base font-bold text-white shadow-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
            </button>
          )}
        </div>

        {saveError && (
          <p className="mt-4 text-sm font-medium text-danger">{saveError}</p>
        )}
      </div>
    </main>
  )
}
