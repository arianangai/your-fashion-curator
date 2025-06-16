import type { GarmentItem, OutfitCombination, OutfitIdea, HistoryEntry } from "./types"

// Local storage keys
export const STORAGE_KEYS = {
  GARMENTS: "garmentItems",
  OUTFITS: "outfitCombinations",
  IDEAS: "outfitIdeas",
  HISTORY: "outfitHistory",
}

// Load data from localStorage
export function loadGarments(): GarmentItem[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.GARMENTS)
  return data ? JSON.parse(data) : []
}

export function loadOutfits(): OutfitCombination[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.OUTFITS)
  return data ? JSON.parse(data) : []
}

export function loadOutfitIdeas(): OutfitIdea[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.IDEAS)
  return data ? JSON.parse(data) : []
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
  return data ? JSON.parse(data) : []
}

// Save data to localStorage
export function saveGarments(garments: GarmentItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.GARMENTS, JSON.stringify(garments))
}

export function saveOutfits(outfits: OutfitCombination[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(outfits))
}

export function saveOutfitIdeas(ideas: OutfitIdea[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas))
}

export function saveHistory(history: HistoryEntry[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
}

// Helper functions for outfit generation
export function generateOutfits(selectedItem: GarmentItem, allItems: GarmentItem[]): OutfitCombination[] {
  const combinations: OutfitCombination[] = []

  // Filter out items of the same category as the selected item
  const otherItems = allItems.filter((i) => i.id !== selectedItem.id)

  // Create complementary outfits based on garment type
  if (
    selectedItem.category === "shirt" ||
    selectedItem.category === "t-shirt" ||
    selectedItem.category === "blouse" ||
    selectedItem.category === "sweater"
  ) {
    // Tops go well with pants, jeans, skirts, shorts
    const bottomItems = otherItems.filter((i) => ["pants", "jeans", "skirt", "shorts"].includes(i.category))

    // Add jackets/coats as optional third pieces
    const outerItems = otherItems.filter((i) => ["jacket", "coat", "blazer", "hoodie"].includes(i.category))

    // Create 2-piece outfits (top + bottom)
    bottomItems.forEach((bottomItem) => {
      combinations.push({
        id: `${selectedItem.id}-${bottomItem.id}`,
        items: [selectedItem, bottomItem],
        season: determineSeason([selectedItem, bottomItem]),
        occasion: determineOccasion([selectedItem, bottomItem]),
      })
    })

    // Create 3-piece outfits (top + bottom + outer)
    bottomItems.forEach((bottomItem) => {
      outerItems.forEach((outerItem) => {
        combinations.push({
          id: `${selectedItem.id}-${bottomItem.id}-${outerItem.id}`,
          items: [selectedItem, bottomItem, outerItem],
          season: determineSeason([selectedItem, bottomItem, outerItem]),
          occasion: determineOccasion([selectedItem, bottomItem, outerItem]),
        })
      })
    })
  } else if (
    selectedItem.category === "pants" ||
    selectedItem.category === "jeans" ||
    selectedItem.category === "skirt" ||
    selectedItem.category === "shorts"
  ) {
    // Bottoms go well with tops
    const topItems = otherItems.filter((i) => ["shirt", "t-shirt", "blouse", "sweater"].includes(i.category))

    // Add jackets/coats as optional third pieces
    const outerItems = otherItems.filter((i) => ["jacket", "coat", "blazer", "hoodie"].includes(i.category))

    // Create 2-piece outfits (bottom + top)
    topItems.forEach((topItem) => {
      combinations.push({
        id: `${selectedItem.id}-${topItem.id}`,
        items: [selectedItem, topItem],
        season: determineSeason([selectedItem, topItem]),
        occasion: determineOccasion([selectedItem, topItem]),
      })
    })

    // Create 3-piece outfits (bottom + top + outer)
    topItems.forEach((topItem) => {
      outerItems.forEach((outerItem) => {
        combinations.push({
          id: `${selectedItem.id}-${topItem.id}-${outerItem.id}`,
          items: [selectedItem, topItem, outerItem],
          season: determineSeason([selectedItem, topItem, outerItem]),
          occasion: determineOccasion([selectedItem, topItem, outerItem]),
        })
      })
    })
  } else if (
    selectedItem.category === "jacket" ||
    selectedItem.category === "coat" ||
    selectedItem.category === "blazer" ||
    selectedItem.category === "hoodie"
  ) {
    // Jackets/coats go well with top+bottom combinations
    const topItems = otherItems.filter((i) => ["shirt", "t-shirt", "blouse", "sweater"].includes(i.category))

    const bottomItems = otherItems.filter((i) => ["pants", "jeans", "skirt", "shorts"].includes(i.category))

    // Create 3-piece outfits (outer + top + bottom)
    topItems.forEach((topItem) => {
      bottomItems.forEach((bottomItem) => {
        combinations.push({
          id: `${selectedItem.id}-${topItem.id}-${bottomItem.id}`,
          items: [selectedItem, topItem, bottomItem],
          season: determineSeason([selectedItem, topItem, bottomItem]),
          occasion: determineOccasion([selectedItem, topItem, bottomItem]),
        })
      })
    })
  } else if (selectedItem.category === "dress") {
    // Dresses can be paired with jackets/coats
    const outerItems = otherItems.filter((i) => ["jacket", "coat", "blazer"].includes(i.category))

    // Create 2-piece outfits (dress + outer)
    outerItems.forEach((outerItem) => {
      combinations.push({
        id: `${selectedItem.id}-${outerItem.id}`,
        items: [selectedItem, outerItem],
        season: determineSeason([selectedItem, outerItem]),
        occasion: determineOccasion([selectedItem, outerItem]),
      })
    })

    // Also add the dress as a standalone outfit
    combinations.push({
      id: `${selectedItem.id}-solo`,
      items: [selectedItem],
      season: selectedItem.season || "all-season",
      occasion: selectedItem.category === "dress" ? "formal" : "casual",
    })
  } else if (selectedItem.category === "suit" || selectedItem.category === "blazer") {
    // Suits and blazers can be paired with shirts
    const shirtItems = otherItems.filter((i) => ["shirt", "blouse"].includes(i.category))

    shirtItems.forEach((shirtItem) => {
      combinations.push({
        id: `${selectedItem.id}-${shirtItem.id}`,
        items: [selectedItem, shirtItem],
        season: determineSeason([selectedItem, shirtItem]),
        occasion: "formal",
      })
    })
  }

  // Limit to 8 combinations
  return combinations.slice(0, 8)
}

// Helper function to determine season based on items
function determineSeason(items: GarmentItem[]): string {
  // If all items have the same season, use that
  const seasons = items.map((item) => item.season).filter(Boolean) as string[]

  if (seasons.length > 0) {
    const uniqueSeasons = [...new Set(seasons)]
    if (uniqueSeasons.length === 1) return uniqueSeasons[0]

    // Count occurrences of each season
    const seasonCounts: Record<string, number> = {}
    seasons.forEach((season) => {
      seasonCounts[season] = (seasonCounts[season] || 0) + 1
    })

    // Find the most common season
    let maxCount = 0
    let mostCommonSeason = "all-season"

    for (const [season, count] of Object.entries(seasonCounts)) {
      if (count > maxCount) {
        maxCount = count
        mostCommonSeason = season
      }
    }

    return mostCommonSeason
  }

  // Default to all-season if no specific season is found
  return "all-season"
}

// Helper function to determine occasion based on items
function determineOccasion(items: GarmentItem[]): string {
  // Check for formal items
  const hasFormalItem = items.some(
    (item) =>
      item.category === "suit" ||
      item.category === "blazer" ||
      (item.category === "dress" && item.occasion === "formal"),
  )

  if (hasFormalItem) return "formal"

  // Check for business items
  const hasBusinessItem = items.some(
    (item) => item.category === "blazer" || (item.category === "shirt" && item.occasion === "business"),
  )

  if (hasBusinessItem) return "business"

  // Default to casual
  return "casual"
}

// Generate outfit ideas based on available garments
export function generateOutfitIdeas(garments: GarmentItem[]): OutfitIdea[] {
  if (garments.length < 3) return []

  const ideas: OutfitIdea[] = []

  // Define some style themes
  const styles = [
    { name: "Casual Weekend", tags: ["casual", "comfortable", "weekend"] },
    { name: "Business Professional", tags: ["formal", "office", "professional"] },
    { name: "Summer Vacation", tags: ["summer", "vacation", "beach"] },
    { name: "Fall Layers", tags: ["fall", "layered", "cozy"] },
    { name: "Night Out", tags: ["evening", "party", "stylish"] },
    { name: "Minimalist", tags: ["simple", "clean", "monochrome"] },
    { name: "Vintage Inspired", tags: ["retro", "classic", "timeless"] },
    { name: "Athleisure", tags: ["sporty", "comfortable", "active"] },
  ]

  // Create outfit ideas based on styles
  styles.forEach((style, index) => {
    const outfitItems: GarmentItem[] = []

    // For casual weekend
    if (style.name === "Casual Weekend") {
      const tshirt = garments.find((g) => g.category === "t-shirt")
      const jeans = garments.find((g) => g.category === "jeans")
      const jacket = garments.find((g) => g.category === "jacket" || g.category === "hoodie")

      if (tshirt) outfitItems.push(tshirt)
      if (jeans) outfitItems.push(jeans)
      if (jacket) outfitItems.push(jacket)
    }
    // For business professional
    else if (style.name === "Business Professional") {
      const shirt = garments.find((g) => g.category === "shirt" || g.category === "blouse")
      const pants = garments.find((g) => g.category === "pants")
      const blazer = garments.find((g) => g.category === "blazer" || g.category === "suit")

      if (shirt) outfitItems.push(shirt)
      if (pants) outfitItems.push(pants)
      if (blazer) outfitItems.push(blazer)
    }
    // For other styles, select random appropriate items
    else {
      // Get a top
      const tops = garments.filter((g) => ["shirt", "t-shirt", "blouse", "sweater"].includes(g.category))
      if (tops.length > 0) {
        outfitItems.push(tops[Math.floor(Math.random() * tops.length)])
      }

      // Get a bottom
      const bottoms = garments.filter((g) => ["pants", "jeans", "skirt", "shorts"].includes(g.category))
      if (bottoms.length > 0) {
        outfitItems.push(bottoms[Math.floor(Math.random() * bottoms.length)])
      }

      // Get an outer layer
      const outers = garments.filter((g) => ["jacket", "coat", "blazer", "hoodie"].includes(g.category))
      if (outers.length > 0 && Math.random() > 0.3) {
        // 70% chance to add an outer layer
        outfitItems.push(outers[Math.floor(Math.random() * outers.length)])
      }
    }

    // Only add the idea if we have at least 2 items
    if (outfitItems.length >= 2) {
      ideas.push({
        id: `idea-${index}`,
        name: style.name,
        style: style.name.toLowerCase(),
        items: outfitItems,
        tags: style.tags,
      })
    }
  })

  return ideas
}

// Add an outfit to history
export function addToHistory(outfit: OutfitCombination, occasion?: string, notes?: string): HistoryEntry {
  const history = loadHistory()

  const entry: HistoryEntry = {
    id: `history-${Date.now()}`,
    outfitId: outfit.id,
    outfit: outfit,
    date: new Date().toISOString(),
    occasion,
    notes,
  }

  history.push(entry)
  saveHistory(history)

  // Also update the outfit's dateUsed array
  const outfits = loadOutfits()
  const outfitIndex = outfits.findIndex((o) => o.id === outfit.id)

  if (outfitIndex >= 0) {
    if (!outfits[outfitIndex].dateUsed) {
      outfits[outfitIndex].dateUsed = []
    }
    outfits[outfitIndex].dateUsed.push(entry.date)
    saveOutfits(outfits)
  }

  return entry
}
