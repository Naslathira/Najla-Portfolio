import { colorAnalysisOptions, colorProfiles } from "../data/colorAnalysisData"

export function analyzeColors(input) {
  const fields = [
    ["hairColor", "hairColors"],
    ["eyeColor", "eyeColors"],
    ["skinTone", "skinTones"],
    ["undertone", "undertones"],
  ]

  const isValid = fields.every(([field, optionKey]) =>
    colorAnalysisOptions[optionKey].includes(input[field]),
  )
  if (!isValid) return null

  return {
    profile: `${input.undertone} palette`,
    ...colorProfiles[input.undertone],
    input: { ...input },
  }
}
