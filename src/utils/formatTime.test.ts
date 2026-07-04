import { describe, expect, it } from 'vitest'

import { formatTime } from '@/utils/formatTime'

describe('formatTime', () => {
  it('formats seconds under a minute', () => {
    expect(formatTime(5)).toBe('0:05')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(125)).toBe('2:05')
  })
})
