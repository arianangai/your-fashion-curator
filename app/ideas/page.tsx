"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Lightbulb, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { useToast } from "@/hooks/use-toast"
import { loadGarments, loadOutfitIdeas, saveOutfitIdeas, generateOutfitIdeas, addToHistory } from "@/lib/data"
import type { OutfitIdea } from "@/lib/types"

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<OutfitIdea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<OutfitIdea[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load items and ideas from localStorage
    const garments = loadGarments()
    let storedIdeas = loadOutfitIdeas()

    // If we don't have any ideas yet, generate some
    if (storedIdeas.length === 0 && garments.length >= 3) {
      storedIdeas = generateOutfitIdeas(garments)
      saveOutfitIdeas(storedIdeas)
    }

    setIdeas(storedIdeas)
    setFilteredIdeas(storedIdeas)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredIdeas(ideas)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredIdeas(
        ideas.filter(
          (idea) =>
            idea.name.toLowerCase().includes(query) ||
            idea.style.toLowerCase().includes(query) ||
            idea.tags.some((tag) => tag.toLowerCase().includes(query)),
        ),
      )
    }
  }, [searchQuery, ideas])

  const handleMarkAsUsed = (idea: OutfitIdea) => {
    // Convert OutfitIdea to OutfitCombination
    const outfit = {
      id: idea.id,
      items: idea.items,
      name: idea.name,
      occasion: idea.tags.includes("formal") ? "formal" : idea.tags.includes("office") ? "business" : "casual",
    }

    // Add to history
    addToHistory(outfit, outfit.occasion, `From outfit idea: ${idea.name}`)

    toast({
      title: "Outfit marked as used",
      description: "This outfit has been added to your history",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Outfit Ideas</h1>
              <p className="text-muted-foreground mt-2">
                Discover new outfit combinations based on your style preferences
              </p>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by style or occasion..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredIdeas.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No outfit ideas found</h3>
              <p className="text-muted-foreground mb-6">
                {ideas.length === 0
                  ? "Upload more garments to generate outfit ideas."
                  : "No ideas match your search query."}
              </p>
              {ideas.length === 0 && <Button onClick={() => router.push("/upload")}>Upload More Items</Button>}
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="break-inside-avoid">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-1">{idea.name}</h3>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {idea.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {idea.items.map((item) => (
                          <div key={item.id} className="relative aspect-square">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.category}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs">
                              <div className="capitalize truncate">{item.category}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => handleMarkAsUsed(idea)}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Used
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
