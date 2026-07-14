import { describe, expect, it } from "vitest"
import { analyzeColors } from "../utils/colorAnalysis"

const baseInput = { hairColor: "Black", eyeColor: "Brown", skinTone: "Medium" }

describe("analyzeColors", () => {
  it.each([
    ["Warm", "Earth Tones", "Gold"],
    ["Cool", "Jewel Tones", "Silver"],
    ["Neutral", "Soft Pinks", "Rose Gold"],
  ])("returns the dataset palette for a %s undertone", (undertone, color, jewelry) => {
    const result = analyzeColors({ ...baseInput, undertone })
    expect(result.recommended).toContain(color)
    expect(result.jewelry).toBe(jewelry)
  })

  it("rejects incomplete input", () => {
    expect(analyzeColors({ ...baseInput, undertone: "" })).toBeNull()
  })

  it("rejects values that do not exist in the dataset", () => {
    expect(analyzeColors({ ...baseInput, hairColor: "Purple", undertone: "Warm" })).toBeNull()
  })
})
