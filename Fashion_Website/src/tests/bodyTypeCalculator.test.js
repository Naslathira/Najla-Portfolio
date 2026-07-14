import { describe, expect, it } from "vitest"
import { calculateBodyType } from "../utils/bodyTypeCalculator"

describe("calculateBodyType", () => {
  it("identifies an hourglass result using centimetres", () => {
    const result = calculateBodyType({ bust: 90, waist: 65, highHip: 80, hip: 92 })
    expect(result.isExactMatch).toBe(true)
    expect(result.primary.name).toBe("Hourglass")
    expect(result.waistHipRatio).toBeCloseTo(0.71, 2)
  })

  it("identifies a triangle when hips are fuller and the waist difference is smaller", () => {
    const result = calculateBodyType({ bust: 80, waist: 75, highHip: 85, hip: 95 })
    expect(result.primary.name).toBe("Triangle")
  })

  it("returns several nearest categories when no rule matches exactly", () => {
    const result = calculateBodyType({ bust: 70, waist: 55, highHip: 65, hip: 100 })
    expect(result.isExactMatch).toBe(false)
    expect(result.primary).toBeNull()
    expect(result.alternatives).toHaveLength(3)
    expect(result.alternatives.map((type) => type.name)).toContain("Spoon")
  })

  it.each([
    { bust: "", waist: 65, highHip: 80, hip: 92 },
    { bust: -1, waist: 65, highHip: 80, hip: 92 },
    { bust: "not-a-number", waist: 65, highHip: 80, hip: 92 },
  ])("rejects missing, negative, or non-numeric input", (measurements) => {
    expect(calculateBodyType(measurements)).toBeNull()
  })
})
