import { describe, expect, it } from 'vitest'

import { getDashboardGreeting } from '@/utils/personalization'

describe('getDashboardGreeting', () => {
  it('returns purpose-specific copy for a known value', () => {
    expect(getDashboardGreeting('check_expected_score')).toBe(
      '지금 실력이면 어느 레벨일지 확인해보세요',
    )
    expect(getDashboardGreeting('improve_speaking')).toBe('강점과 개선점을 짚어드릴게요')
    expect(getDashboardGreeting('realistic_practice')).toBe('실전처럼 3문제, 바로 연습해보세요')
  })

  it('falls back to the default copy for null', () => {
    expect(getDashboardGreeting(null)).toBe('OPIC 말하기 연습, 지금 시작해보세요')
  })

  it('falls back to the default copy for an unmapped value', () => {
    expect(getDashboardGreeting('unexpected_value' as never)).toBe(
      'OPIC 말하기 연습, 지금 시작해보세요',
    )
  })
})
