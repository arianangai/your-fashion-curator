export interface GarmentItem {
  id: number
  image: string
  category: string
  color?: string
  pattern?: string
  season?: string
  brand?: string
  description?: string
  uploadDate: string
  confidence?: number
}

export interface OutfitCombination {
  id: string
  items: GarmentItem[]
  name?: string
  occasion?: string
  season?: string
  dateUsed?: string[]
}

export interface OutfitIdea {
  id: string
  name: string
  style: string
  items: GarmentItem[]
  imageUrl?: string
  tags: string[]
}

export interface HistoryEntry {
  id: string
  outfitId: string
  outfit: OutfitCombination
  date: string
  occasion?: string
  notes?: string
}

export type GarmentCategory =
  | "shirt"
  | "t-shirt"
  | "blouse"
  | "sweater"
  | "pants"
  | "jeans"
  | "shorts"
  | "skirt"
  | "dress"
  | "jacket"
  | "coat"
  | "hoodie"
  | "suit"
  | "blazer"
  | "other"

export const GARMENT_CATEGORIES: GarmentCategory[] = [
  "shirt",
  "t-shirt",
  "blouse",
  "sweater",
  "pants",
  "jeans",
  "shorts",
  "skirt",
  "dress",
  "jacket",
  "coat",
  "hoodie",
  "suit",
  "blazer",
  "other",
]

export const SEASONS = ["spring", "summer", "fall", "winter", "all-season"]
export const OCCASIONS = ["casual", "formal", "business", "sports", "party", "everyday"]
export const COLORS = [
  "black",
  "white",
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
  "orange",
  "brown",
  "gray",
  "beige",
  "multicolor",
]
export const PATTERNS = [
  "solid",
  "striped",
  "plaid",
  "checkered",
  "floral",
  "polka dot",
  "geometric",
  "animal print",
  "other",
]
