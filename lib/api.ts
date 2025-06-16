// API client for the FastAPI backend

const API_URL = "http://localhost:8100"

// Garment API
export async function fetchGarments(category?: string) {
  const url =
    category && category !== "all" ? `${API_URL}/api/garments/?category=${category}` : `${API_URL}/api/garments/`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch garments")
  }
  const json = await response.json()
  console.log("json.garments",json.garments)
  return json.garments
}

export async function fetchGarment(id: number) {
  const response = await fetch(`${API_URL}/api/garments/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch garment")
  }
  return response.json()
}

export async function uploadGarment(file: File) {
  const formData = new FormData()
  formData.append("image", file)
  console.log('url', `${API_URL}/api/garment/create`)

  const response = await fetch(`${API_URL}/api/garment/create/`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload garment")
  }

  return response.json()
}

export async function updateGarment(id: number, data: any) {
  const response = await fetch(`${API_URL}/api/garments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update garment")
  }

  return response.json()
}

// Outfit API
export async function fetchOutfits(garmentId?: number) {
  const url = garmentId ? `${API_URL}/api/outfits/?garment_id=${garmentId}` : `${API_URL}/api/outfits/`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch outfits")
  }
  return response.json()
}

export async function generateOutfits(garmentId: number) {
  const response = await fetch(`${API_URL}/api/outfits/generate/${garmentId}`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to generate outfits")
  }

  return response.json()
}

// Outfit Ideas API
export async function fetchOutfitIdeas(style?: string) {
  const url = style ? `${API_URL}/api/outfit-ideas/?style=${style}` : `${API_URL}/api/outfit-ideas/`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch outfit ideas")
  }
  return response.json()
}

export async function generateOutfitIdeas() {
  const response = await fetch(`${API_URL}/api/outfit-ideas/generate`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to generate outfit ideas")
  }

  return response.json()
}

// History API
export async function fetchHistory(occasion?: string) {
  const url = occasion ? `${API_URL}/api/history/?occasion=${occasion}` : `${API_URL}/api/history/`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch history")
  }
  return response.json()
}

export async function addToHistory(outfitId: number, occasion?: string, notes?: string) {
  const response = await fetch(`${API_URL}/api/history/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      outfit_id: outfitId,
      occasion,
      notes,
      date: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to add to history")
  }

  return response.json()
}

// Image classification API
export async function classifyImage(file: File) {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch(`${API_URL}/api/classify-image/`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to classify image")
  }

  return response.json()
}
