export function recommendSize(product, measurements) {
  const { bust, waist, hip } = measurements

  // All three measurements are required
  if (bust === "" || waist === "" || hip === "") {
    return null
  }

  const bustNum = Number(bust)
  const waistNum = Number(waist)
  const hipNum = Number(hip)

  const sizeChart = product.sizeChart
  const votes = {}

  // For each size, count how many of the three measurements fall within range
  Object.entries(sizeChart).forEach(([size, chart]) => {
    let matches = 0

    if (bustNum >= chart.bust[0] && bustNum <= chart.bust[1]) matches++
    if (waistNum >= chart.waist[0] && waistNum <= chart.waist[1]) matches++
    if (hipNum >= chart.hip[0] && hipNum <= chart.hip[1]) matches++

    // A size is a candidate only when at least 2 of 3 measurements match
    if (matches >= 2) {
      votes[size] = (votes[size] || 0) + 1
    }
  })

  // Pick the size with the most votes (majority rule)
  let bestSize = null
  let maxVotes = 0

  Object.entries(votes).forEach(([size, count]) => {
    if (count > maxVotes) {
      maxVotes = count
      bestSize = size
    }
  })

  return bestSize || null
}
