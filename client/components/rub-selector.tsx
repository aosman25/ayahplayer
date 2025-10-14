"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Chapter } from "@/lib/api-client"

export type ListeningMode = "juz" | "hizb" | "rub" | "chapter"

interface RubSelectorProps {
  onRubChange: (rubNumber: number) => void
  selectedRub?: number
  mode: ListeningMode
  onModeChange: (mode: ListeningMode) => void
  chapters?: Chapter[] // Added chapters prop for chapter mode
}

export function RubSelector({ onRubChange, selectedRub, mode, onModeChange, chapters = [] }: RubSelectorProps) {
  const handleRubChange = (value: string) => {
    onRubChange(Number.parseInt(value, 10))
  }

  const handleModeChange = (value: string) => {
    onModeChange(value as ListeningMode)
  }

  // Generate numbers based on mode
  const getNumbers = () => {
    switch (mode) {
      case "juz":
        return Array.from({ length: 30 }, (_, i) => i + 1)
      case "hizb":
        return Array.from({ length: 60 }, (_, i) => i + 1)
      case "rub":
        return Array.from({ length: 240 }, (_, i) => i + 1)
      case "chapter":
        return Array.from({ length: 114 }, (_, i) => i + 1)
    }
  }

  const getLabel = () => {
    switch (mode) {
      case "juz":
        return "Juz Number (1-30)"
      case "hizb":
        return "Hizb Number (1-60)"
      case "rub":
        return "Rub Number (1-240)"
      case "chapter":
        return "Chapter (1-114)"
    }
  }

  const getPlaceholder = () => {
    switch (mode) {
      case "juz":
        return "Select a juz number"
      case "hizb":
        return "Select a hizb number"
      case "rub":
        return "Select a rub number"
      case "chapter":
        return "Select a chapter"
    }
  }

  const getDisplayName = (num: number) => {
    switch (mode) {
      case "juz":
        return `Juz ${num}`
      case "hizb":
        return `Hizb ${num}`
      case "rub":
        return `Rub ${num}`
      case "chapter":
        const chapter = chapters[num - 1]
        return chapter ? `${num}. ${chapter.name_simple}` : `Chapter ${num}`
    }
  }

  const numbers = getNumbers()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Listening Mode</Label>
        <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chapter">Chapter</TabsTrigger>
            <TabsTrigger value="juz">Juz</TabsTrigger>
            <TabsTrigger value="hizb">Hizb</TabsTrigger>
            <TabsTrigger value="rub">Rub</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2">
        <Label htmlFor="segment-select">{getLabel()}</Label>
        <Select value={selectedRub?.toString() ?? ""} onValueChange={handleRubChange}>
          <SelectTrigger id="segment-select" className="w-full">
            <SelectValue placeholder={getPlaceholder()} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {numbers.map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {getDisplayName(num)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
