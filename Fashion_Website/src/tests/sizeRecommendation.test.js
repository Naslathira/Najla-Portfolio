import { describe, expect, it } from 'vitest'
import { standardSizeChart } from '../data/products'
import { recommendSize } from '../utils/sizeRecommendation'

const product = { sizeChart: standardSizeChart }

describe('recommendSize', () => {
  it('recommends a size when all measurements fit the same range', () => {
    expect(recommendSize(product, { bust: 89, waist: 70, hip: 94 })).toBe('S')
  })

  it('uses the two-out-of-three majority rule', () => {
    expect(recommendSize(product, { bust: 89, waist: 75, hip: 94 })).toBe('S')
  })

  it('includes exact lower and upper size boundaries', () => {
    expect(recommendSize(product, { bust: 76, waist: 59.5, hip: 84 })).toBe('XXS')
    expect(recommendSize(product, { bust: 108, waist: 92.5, hip: 115.5 })).toBe('XL')
  })

  it.each([
    [{ bust: '', waist: 70, hip: 94 }],
    [{ bust: 89, waist: '', hip: 94 }],
    [{ bust: 89, waist: 70, hip: '' }],
  ])('returns null when a required measurement is missing', (measurements) => {
    expect(recommendSize(product, measurements)).toBeNull()
  })

  it('returns null when fewer than two measurements match a size', () => {
    expect(recommendSize(product, { bust: 10, waist: 70, hip: 200 })).toBeNull()
  })
})
