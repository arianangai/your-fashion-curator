"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Grid, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { fetchGarments } from "@/lib/api"
import { GARMENT_CATEGORIES } from "@/lib/types"

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadGarments = async () => {
      try {
        setIsLoading(true)
        const data = await fetchGarments()
        setItems(data)
        setFilteredItems(data)
      } catch (error) {
        console.error("Failed to load garments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadGarments()
  }, [])

  useEffect(() => {
    const filterItems = async () => {
      try {
        setIsLoading(true)
        const data = await fetchGarments(selectedCategory)
        setFilteredItems(data)
      } catch (error) {
        console.error("Failed to filter garments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    filterItems()
  }, [selectedCategory])

  const handleItemClick = (item) => {
    router.push(`/outfit/${item.id}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Your Garment Gallery</h1>
              <p className="text-muted-foreground mt-2">Browse your uploaded items by category</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {GARMENT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Grid className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No items found</h3>
              <p className="text-muted-foreground mb-6">
                {items.length === 0
                  ? "You haven't uploaded any garments yet."
                  : "No items match the selected category."}
              </p>
              {items.length === 0 && (
                <Link href="/upload">
                  <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Garments
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-0 relative">
                    <img
                      src={`data:${item.content_type};base64,${item.image_base64}` || "/placeholder.svg"}
                      alt={`${item.category} item`}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                      <div className="text-sm font-medium capitalize">{item.category}</div>
                      {/* {item.confidence && (
                        <div className="text-xs opacity-80">Confidence: {Math.round(item.confidence * 100)}%</div>
                      )} */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
