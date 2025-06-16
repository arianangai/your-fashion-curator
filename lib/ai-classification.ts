import { type GarmentCategory, GARMENT_CATEGORIES } from "./types"

// Function to classify an image using Fal AI
export async function classifyGarmentImage(imageBase64: string): Promise<{
  category: GarmentCategory
  confidence: number
}> {
  try {
    // Remove the data URL prefix if present
    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64

    // Call Fal AI API for image classification
    const response = await fetch("https://api.fal.ai/v1/image-classification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${process.env.NEXT_PUBLIC_FAL_KEY}`,
      },
      body: JSON.stringify({
        image: {
          data: base64Data,
        },
        model: "clothing-classifier",
        options: {
          confidence_threshold: 0.1,
          max_results: 5,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Map the API response to our garment categories
    // This is a simplified example - in a real app, you'd have more sophisticated mapping
    const results = data.results || []

    if (results.length === 0) {
      return { category: "other", confidence: 0 }
    }

    // Get the top result
    const topResult = results[0]
    const label = topResult.label.toLowerCase()
    const confidence = topResult.confidence

    // Map the API label to our categories
    let category: GarmentCategory = "other"

    // Simple mapping logic - would be more sophisticated in a real app
    if (label.includes("shirt") || label.includes("top")) {
      category = "shirt"
    } else if (label.includes("t-shirt") || label.includes("tee")) {
      category = "t-shirt"
    } else if (label.includes("blouse")) {
      category = "blouse"
    } else if (label.includes("sweater") || label.includes("pullover")) {
      category = "sweater"
    } else if (label.includes("pants") || label.includes("trousers")) {
      category = "pants"
    } else if (label.includes("jeans") || label.includes("denim")) {
      category = "jeans"
    } else if (label.includes("shorts")) {
      category = "shorts"
    } else if (label.includes("skirt")) {
      category = "skirt"
    } else if (label.includes("dress")) {
      category = "dress"
    } else if (label.includes("jacket")) {
      category = "jacket"
    } else if (label.includes("coat")) {
      category = "coat"
    } else if (label.includes("hoodie") || label.includes("sweatshirt")) {
      category = "hoodie"
    } else if (label.includes("suit")) {
      category = "suit"
    } else if (label.includes("blazer")) {
      category = "blazer"
    } else {
      category = "other"
    }

    return { category, confidence }
  } catch (error) {
    console.error("Error classifying image:", error)
    // Return a default category in case of error
    return { category: "other", confidence: 0 }
  }
}

// Fallback function for when AI classification fails or is not available
export function fallbackClassification(imageBase64: string): Promise<{
  category: GarmentCategory
  confidence: number
}> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate a random category for demo purposes
      const randomIndex = Math.floor(Math.random() * (GARMENT_CATEGORIES.length - 1)) // Exclude "other"
      const category = GARMENT_CATEGORIES[randomIndex]
      const confidence = 0.7 + Math.random() * 0.3 // Random confidence between 0.7 and 1.0

      resolve({ category, confidence })
    }, 1000)
  })
}
