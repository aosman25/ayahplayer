"use client"

import { useState, useEffect } from "react"
import { api, type Recitation } from "@/lib/api-client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface ReciterSelectorProps {
  onReciterChange: (reciterId: number, reciterName: string, style: string) => void
  selectedReciterId?: number
}

export function ReciterSelector({ onReciterChange, selectedReciterId }: ReciterSelectorProps) {
  const [reciters, setReciters] = useState<Recitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReciters() {
      try {
        setLoading(true)
        const data = await api.getReciters("en")
        setReciters(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching reciters:", err)
        setError("Failed to load reciters. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchReciters()
  }, [])

  // Group reciters by reciter name
  const groupedReciters = reciters.reduce(
    (acc, reciter) => {
      if (!acc[reciter.reciter_name]) {
        acc[reciter.reciter_name] = []
      }
      acc[reciter.reciter_name].push(reciter)
      return acc
    },
    {} as Record<string, Recitation[]>,
  )

  const handleReciterChange = (value: string) => {
    const reciter = reciters.find((r) => r.id.toString() === value)
    if (reciter) {
      onReciterChange(reciter.id, reciter.reciter_name, reciter.style)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Reciter & Style</Label>
        <div className="flex items-center justify-center h-10 border rounded-lg bg-muted/50">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>Reciter & Style</Label>
        <div className="text-sm text-destructive p-3 border border-destructive/50 rounded-lg bg-destructive/10">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="reciter-select">Reciter & Style</Label>
      <Select value={selectedReciterId?.toString()} onValueChange={handleReciterChange}>
        <SelectTrigger id="reciter-select" className="w-full">
          <SelectValue placeholder="Select a reciter and style" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedReciters).map(([reciterName, recitations]) => (
            <div key={reciterName}>
              {recitations.length === 1 ? (
                <SelectItem value={recitations[0].id.toString()}>{reciterName}</SelectItem>
              ) : (
                recitations.map((recitation) => (
                  <SelectItem key={recitation.id} value={recitation.id.toString()}>
                    {reciterName}
                    {recitation.style ? ` - ${recitation.style}` : ""}
                  </SelectItem>
                ))
              )}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
