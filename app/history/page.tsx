"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Filter, HistoryIcon } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { loadHistory } from "@/lib/data"
import { type HistoryEntry, OCCASIONS } from "@/lib/types"

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([])
  const [selectedOccasion, setSelectedOccasion] = useState<string>("all")

  useEffect(() => {
    // Load history from localStorage
    const storedHistory = loadHistory()
    // Sort by date, newest first
    const sortedHistory = storedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setHistory(sortedHistory)
    setFilteredHistory(sortedHistory)
  }, [])

  useEffect(() => {
    if (selectedOccasion === "all") {
      setFilteredHistory(history)
    } else {
      setFilteredHistory(history.filter((entry) => entry.occasion === selectedOccasion))
    }
  }, [selectedOccasion, history])

  // Group history entries by month
  const groupedHistory: Record<string, HistoryEntry[]> = {}

  filteredHistory.forEach((entry) => {
    const date = new Date(entry.date)
    const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`

    if (!groupedHistory[monthYear]) {
      groupedHistory[monthYear] = []
    }

    groupedHistory[monthYear].push(entry)
  })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Outfit History</h1>
              <p className="text-muted-foreground mt-2">Track the outfits you've worn and when you wore them</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Occasions</SelectItem>
                  {OCCASIONS.map((occasion) => (
                    <SelectItem key={occasion} value={occasion}>
                      {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No outfit history found</h3>
              <p className="text-muted-foreground mb-6">
                {history.length === 0
                  ? "You haven't marked any outfits as used yet."
                  : "No history matches the selected occasion."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedHistory).map(([monthYear, entries]) => (
                <div key={monthYear}>
                  <h2 className="text-xl font-semibold mb-4">{monthYear}</h2>
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <Card key={entry.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-shrink-0 flex items-center justify-center bg-muted rounded-md p-3 w-full md:w-auto">
                              <Calendar className="h-5 w-5 mr-2" />
                              <span>{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                            {entry.occasion && (
                              <div className="flex items-center">
                                <span className="text-sm text-muted-foreground mr-2">Occasion:</span>
                                <span className="capitalize">{entry.occasion}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <h3 className="font-medium mb-2">Outfit</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                              {entry.outfit.items.map((item) => (
                                <div key={item.id} className="relative">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.category}
                                    className="w-full aspect-square object-cover rounded-md"
                                  />
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs rounded-b-md">
                                    <div className="capitalize truncate">{item.category}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {entry.notes && (
                            <div className="mt-3 text-sm">
                              <span className="text-muted-foreground">Notes:</span> {entry.notes}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
