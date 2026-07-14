import pinkBra from "../assets/products/sport-bra_pink.png"
import blackBra from "../assets/products/sport-bra_black.png"
import leopardBra from "../assets/products/sport-bra_leopard.png"
import maroonHalterTop from "../assets/products/tank-top_maroon.png"

// Standardized size chart shared by every product (cm)
export const standardSizeChart = {
  XXS: { bust: [76, 81.5], underBust: [63.5, 66], waist: [59.5, 62], hip: [84, 86.5] },
  XS: { bust: [81.5, 86.5], underBust: [68.5, 71], waist: [63.5, 67.5], hip: [87.5, 91.5] },
  S: { bust: [86.5, 91.5], underBust: [71, 73.5], waist: [68.5, 72.5], hip: [92.5, 96.5] },
  M: { bust: [91.5, 96.5], underBust: [76, 80], waist: [73.5, 77.5], hip: [98, 101.5] },
  L: { bust: [96.5, 101.5], underBust: [81.5, 85], waist: [78.5, 85], hip: [103, 108] },
  XL: { bust: [101.5, 108], underBust: [86.5, 91.5], waist: [86.5, 92.5], hip: [109, 115.5] },
}

export const categories = [
  { slug: "sport-bra", name: "Sport Bra" },
  { slug: "tank-top", name: "Tank Top" },
  { slug: "legging", name: "Legging" },
]

export const products = [
  {
    id: 1,
    name: "Soft Pink Sculpt Bra",
    category: "Sports Bra",
    categorySlug: "sport-bra",
    price: 49,
    image: pinkBra,
    description:
      "A feminine activewear bra with soft support and elegant details.",
    sizeChart: standardSizeChart,
  },

  {
    id: 2,
    name: "Leopard Muse Bra",
    category: "Sports Bra",
    categorySlug: "sport-bra",
    price: 55,
    image: leopardBra,
    description:
      "Soft brown leopard activewear with playful feminine energy.",
    sizeChart: standardSizeChart,
  },

  {
    id: 3,
    name: "Black Ribbon Bra",
    category: "Sports Bra",
    categorySlug: "sport-bra",
    price: 59,
    image: blackBra,
    description:
      "Elegant black activewear with pink details and sporty silhouette.",
    sizeChart: standardSizeChart,
  },

  {
    id: 4,
    name: "Maroon Halter Top",
    category: "Tank Top",
    categorySlug: "tank-top",
    price: 70,
    image: maroonHalterTop,
    description:
      "Elegant Maroon haltertop with sporty silhouette.",
    sizeChart: standardSizeChart,
  },
]
