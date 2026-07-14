const INCH = 2.54
const thresholds = {
  one: 1 * INCH,
  two: 2 * INCH,
  threePointSix: 3.6 * INCH,
  seven: 7 * INCH,
  nine: 9 * INCH,
  ten: 10 * INCH,
}

const atLeast = (value, minimum) => Math.max(0, minimum - value)
const greaterThan = (value, minimum) => Math.max(0, minimum - value + 0.01)
const atMost = (value, maximum) => Math.max(0, value - maximum)
const lessThan = (value, maximum) => Math.max(0, value - maximum + 0.01)

export const bodyTypes = [
  {
    id: "hourglass",
    name: "Hourglass",
    description: "Bust and hips are nearly balanced, with a clearly defined waist.",
    matches: ({ bustHip, hipBust, bustWaist, hipWaist }) =>
      bustHip <= thresholds.one && hipBust < thresholds.threePointSix &&
      (bustWaist >= thresholds.nine || hipWaist >= thresholds.ten),
    distance: ({ bustHip, hipBust, bustWaist, hipWaist }) =>
      atMost(bustHip, thresholds.one) + lessThan(hipBust, thresholds.threePointSix) +
      Math.min(atLeast(bustWaist, thresholds.nine), atLeast(hipWaist, thresholds.ten)),
  },
  {
    id: "bottom-hourglass",
    name: "Bottom Hourglass",
    description: "Hips are moderately fuller than the bust, with a defined waist.",
    matches: ({ hipBust, hipWaist, highHipRatio }) =>
      hipBust >= thresholds.threePointSix && hipBust < thresholds.ten &&
      hipWaist >= thresholds.nine && highHipRatio < 1.193,
    distance: ({ hipBust, hipWaist, highHipRatio }) =>
      atLeast(hipBust, thresholds.threePointSix) + lessThan(hipBust, thresholds.ten) +
      atLeast(hipWaist, thresholds.nine) + lessThan(highHipRatio, 1.193) * 20,
  },
  {
    id: "top-hourglass",
    name: "Top Hourglass",
    description: "Bust is moderately fuller than the hips, with a defined waist.",
    matches: ({ bustHip, bustWaist }) =>
      bustHip > thresholds.one && bustHip < thresholds.ten && bustWaist >= thresholds.nine,
    distance: ({ bustHip, bustWaist }) =>
      greaterThan(bustHip, thresholds.one) + lessThan(bustHip, thresholds.ten) +
      atLeast(bustWaist, thresholds.nine),
  },
  {
    id: "spoon",
    name: "Spoon",
    description: "Hips are fuller than the bust, with more fullness around the upper hip.",
    matches: ({ hipBust, hipWaist, highHipRatio }) =>
      hipBust > thresholds.two && hipWaist >= thresholds.seven && highHipRatio >= 1.193,
    distance: ({ hipBust, hipWaist, highHipRatio }) =>
      greaterThan(hipBust, thresholds.two) + atLeast(hipWaist, thresholds.seven) +
      atLeast(highHipRatio, 1.193) * 20,
  },
  {
    id: "triangle",
    name: "Triangle",
    description: "Hips are noticeably fuller than the bust, with a less-defined waist.",
    matches: ({ hipBust, hipWaist }) =>
      hipBust >= thresholds.threePointSix && hipWaist < thresholds.nine,
    distance: ({ hipBust, hipWaist }) =>
      atLeast(hipBust, thresholds.threePointSix) + lessThan(hipWaist, thresholds.nine),
  },
  {
    id: "inverted-triangle",
    name: "Inverted Triangle",
    description: "Bust is noticeably fuller than the hips, with a less-defined waist.",
    matches: ({ bustHip, bustWaist }) =>
      bustHip >= thresholds.threePointSix && bustWaist < thresholds.nine,
    distance: ({ bustHip, bustWaist }) =>
      atLeast(bustHip, thresholds.threePointSix) + lessThan(bustWaist, thresholds.nine),
  },
  {
    id: "rectangle",
    name: "Rectangle",
    description: "Bust and hips are balanced, with a gently defined waist.",
    matches: ({ hipBust, bustHip, bustWaist, hipWaist }) =>
      hipBust < thresholds.threePointSix && bustHip < thresholds.threePointSix &&
      bustWaist < thresholds.nine && hipWaist < thresholds.ten,
    distance: ({ hipBust, bustHip, bustWaist, hipWaist }) =>
      lessThan(hipBust, thresholds.threePointSix) + lessThan(bustHip, thresholds.threePointSix) +
      lessThan(bustWaist, thresholds.nine) + lessThan(hipWaist, thresholds.ten),
  },
]

export function calculateBodyType(measurements) {
  const bust = Number(measurements.bust)
  const waist = Number(measurements.waist)
  const highHip = Number(measurements.highHip)
  const hip = Number(measurements.hip)

  if ([bust, waist, highHip, hip].some((value) => !Number.isFinite(value) || value <= 0)) {
    return null
  }

  const metrics = {
    bustHip: bust - hip,
    hipBust: hip - bust,
    bustWaist: bust - waist,
    hipWaist: hip - waist,
    highHipRatio: highHip / waist,
  }
  const exactMatches = bodyTypes.filter((type) => type.matches(metrics))
  const ranked = bodyTypes
    .map((type) => ({ ...type, distance: type.distance(metrics) }))
    .sort((a, b) => a.distance - b.distance)

  return {
    primary: exactMatches[0] || null,
    alternatives: exactMatches.length > 1
      ? exactMatches.slice(1, 3)
      : exactMatches.length === 1
        ? ranked.filter((type) => type.id !== exactMatches[0].id).slice(0, 2)
        : ranked.slice(0, 3),
    isExactMatch: exactMatches.length > 0,
    waistHipRatio: waist / hip,
  }
}
