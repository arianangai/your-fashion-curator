"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Heart, Share2, ShoppingBag, Edit, Check } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { loadGarments, saveGarments, generateOutfits, loadOutfits, saveOutfits, addToHistory } from "@/lib/data"
import {
  type GarmentItem,
  type OutfitCombination,
  GARMENT_CATEGORIES,
  COLORS,
  PATTERNS,
  SEASONS,
  OCCASIONS,
} from "@/lib/types"

export default function OutfitPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedItem, setSelectedItem] = useState<GarmentItem | null>(null)
  const [outfits, setOutfits] = useState<OutfitCombination[]>([])
  const [allItems, setAllItems] = useState<GarmentItem[]>([])
  const [editedItem, setEditedItem] = useState<GarmentItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Load items from localStorage
    const storedItems = loadGarments()
    setAllItems(storedItems)

    // Find the selected item
    const item = storedItems.find((item) => item.id.toString() === params.id)
    if (item) {
      setSelectedItem(item)
      setEditedItem({ ...item }) // Create a copy for editing

      // Load or generate outfit combinations
      const storedOutfits = loadOutfits()
      const itemOutfits = storedOutfits.filter((outfit) => outfit.items.some((outfitItem) => outfitItem.id === item.id))

      if (itemOutfits.length > 0) {
        setOutfits(itemOutfits)
      } else {
        // Generate new outfits
        const newOutfits = generateOutfits(item, storedItems)
        setOutfits(newOutfits)

        // Save the generated outfits
        saveOutfits([...storedOutfits, ...newOutfits])
      }
    } else {
      // Item not found, redirect to gallery
      router.push("/gallery")
    }
  }, [params.id, router])

  const handleSaveEdit = () => {
    if (!editedItem) return

    // Update the item in localStorage
    const updatedItems = allItems.map((item) => (item.id === editedItem.id ? editedItem : item))

    saveGarments(updatedItems)
    setAllItems(updatedItems)
    setSelectedItem(editedItem)

    // Update outfits that contain this item
    const storedOutfits = loadOutfits()
    const updatedOutfits = storedOutfits.map((outfit) => {
      const updatedOutfitItems = outfit.items.map((item) => (item.id === editedItem.id ? editedItem : item))
      return { ...outfit, items: updatedOutfitItems }
    })

    saveOutfits(updatedOutfits)

    // Update current outfits state
    const currentOutfits = outfits.map((outfit) => {
      const updatedOutfitItems = outfit.items.map((item) => (item.id === editedItem.id ? editedItem : item))
      return { ...outfit, items: updatedOutfitItems }
    })

    setOutfits(currentOutfits)

    toast({
      title: "Changes saved",
      description: "Your garment details have been updated",
    })

    setIsDialogOpen(false)
  }

  const handleMarkAsUsed = (outfit: OutfitCombination) => {
    // Add to history
    addToHistory(outfit)

    toast({
      title: "Outfit marked as used",
      description: "This outfit has been added to your history",
    })
  }

  if (!selectedItem) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" className="mb-6" onClick={() => router.push("/gallery")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <img
                    src={selectedItem.image || "/placeholder.svg"}
                    alt={`${selectedItem.category} item`}
                    className="w-full aspect-square object-cover"
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between items-center mt-4">
                <div>
                  <h2 className="text-2xl font-bold capitalize">{selectedItem.category}</h2>
                  <p className="text-muted-foreground">
                    Uploaded on {new Date(selectedItem.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Garment Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="category" className="text-right">
                            Category
                          </Label>
                          <Select
                            value={editedItem?.category}
                            onValueChange={(value) =>
                              setEditedItem((prev) => (prev ? { ...prev, category: value } : null))
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {GARMENT_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="color" className="text-right">
                            Color
                          </Label>
                          <Select
                            value={editedItem?.color || ""}
                            onValueChange={(value) =>
                              setEditedItem((prev) => (prev ? { ...prev, color: value } : null))
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              {COLORS.map((color) => (
                                <SelectItem key={color} value={color}>
                                  {color.charAt(0).toUpperCase() + color.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="pattern" className="text-right">
                            Pattern
                          </Label>
                          <Select
                            value={editedItem?.pattern || ""}
                            onValueChange={(value) =>
                              setEditedItem((prev) => (prev ? { ...prev, pattern: value } : null))
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              {PATTERNS.map((pattern) => (
                                <SelectItem key={pattern} value={pattern}>
                                  {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="season" className="text-right">
                            Season
                          </Label>
                          <Select
                            value={editedItem?.season || ""}
                            onValueChange={(value) =>
                              setEditedItem((prev) => (prev ? { ...prev, season: value } : null))
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select season" />
                            </SelectTrigger>
                            <SelectContent>
                              {SEASONS.map((season) => (
                                <SelectItem key={season} value={season}>
                                  {season.charAt(0).toUpperCase() + season.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="occasion" className="text-right">
                            Occasion
                          </Label>
                          <Select
                            value={editedItem?.occasion || ""}
                            onValueChange={(value) =>
                              setEditedItem((prev) => (prev ? { ...prev, occasion: value } : null))
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select occasion" />
                            </SelectTrigger>
                            <SelectContent>
                              {OCCASIONS.map((occasion) => (
                                <SelectItem key={occasion} value={occasion}>
                                  {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="brand" className="text-right">
                            Brand
                          </Label>
                          <Input
                            id="brand"
                            value={editedItem?.brand || ""}
                            onChange={(e) =>
                              setEditedItem((prev) => (prev ? { ...prev, brand: e.target.value } : null))
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="description" className="text-right pt-2">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={editedItem?.description || ""}
                            onChange={(e) =>
                              setEditedItem((prev) => (prev ? { ...prev, description: e.target.value } : null))
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSaveEdit}>
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Outfit Combinations</h2>
              <p className="text-muted-foreground mb-6">
                Here are some stylish outfit combinations using this {selectedItem.category}.
              </p>

              <Tabs defaultValue="outfits">
                <TabsList className="mb-4">
                  <TabsTrigger value="outfits">Suggested Outfits</TabsTrigger>
                  <TabsTrigger value="details">Item Details</TabsTrigger>
                </TabsList>
                <TabsContent value="outfits">
                  {outfits.length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No outfits available</h3>
                      <p className="text-muted-foreground mb-4">Upload more items to create outfit combinations.</p>
                      <Link href="/upload">
                        <Button>Upload More Items</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {outfits.map((outfit, index) => (
                        <div key={outfit.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">Outfit {index + 1}</h3>
                            <Button variant="outline" size="sm" onClick={() => handleMarkAsUsed(outfit)}>
                              <Check className="h-4 w-4 mr-2" />
                              Mark as Used
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {outfit.items.map((item) => (
                              <div key={item.id} className="relative">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.category}
                                  className="w-full aspect-square object-cover rounded-md"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs rounded-b-md">
                                  <div className="capitalize">{item.category}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {(outfit.season || outfit.occasion) && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              {outfit.season && <span className="capitalize mr-2">Season: {outfit.season}</span>}
                              {outfit.occasion && <span className="capitalize">Occasion: {outfit.occasion}</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="details">
                  <div className="border rounded-lg p-6">
                    <h3 className="font-medium mb-4">Item Information</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="capitalize">{selectedItem.category}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Color:</span>
                        <span className="capitalize">{selectedItem.color || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Pattern:</span>
                        <span className="capitalize">{selectedItem.pattern || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Season:</span>
                        <span className="capitalize">{selectedItem.season || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Brand:</span>
                        <span>{selectedItem.brand || "Not specified"}</span>
                      </div>
                      <div className="grid grid-cols-2">
                        <span className="text-muted-foreground">Upload Date:</span>
                        <span>{new Date(selectedItem.uploadDate).toLocaleDateString()}</span>
                      </div>
                      {selectedItem.description && (
                        <div className="col-span-2 mt-2">
                          <span className="text-muted-foreground block mb-1">Description:</span>
                          <p>{selectedItem.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
