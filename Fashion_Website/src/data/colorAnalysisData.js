// Derived from the Kaggle Fashion and Color Recommendation Dataset.
// Source: suryaprabha19/fashion-and-color-recommendation-dataset (CC-BY-NC-SA-4.0)
export const colorAnalysisOptions = {
  hairColors: ["Black", "Brown", "Red", "Blonde", "Grey"],
  eyeColors: ["Brown", "Green", "Blue", "Hazel", "Grey", "Black", "Light Brown", "Light Blue"],
  skinTones: ["Very Fair", "Fair", "Medium", "Olive", "Brown", "Very Dark"],
  undertones: ["Warm", "Cool", "Neutral"],
}

export const colorProfiles = {
  Warm: {
    recommended: ["Earth Tones", "Olive", "Coral", "Peach", "Mustard", "Warm Red"],
    avoid: ["Cool Blue", "Icy Gray", "Jewel Tones"],
    wheelRegion: "Warm colors: red, orange, yellow, and warm greens",
    jewelry: "Gold",
  },
  Cool: {
    recommended: ["Jewel Tones", "Icy Blue", "Lavender", "Silver", "Emerald"],
    avoid: ["Orange", "Mustard", "Brown"],
    wheelRegion: "Cool colors: blue, green, violet, and cool grays",
    jewelry: "Silver",
  },
  Neutral: {
    recommended: ["Soft Pinks", "Plums", "Teal", "Neutral Beige"],
    avoid: ["Fluorescents", "Harsh Yellow"],
    wheelRegion: "Neutral-friendly colors balancing warm and cool, such as teal, plum, and taupe",
    jewelry: "Rose Gold",
  },
}
