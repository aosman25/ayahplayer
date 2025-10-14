"use client"

import { useState, useEffect } from "react"
import { ReciterSelector } from "@/components/reciter-selector"
import { RubSelector, type ListeningMode } from "@/components/rub-selector"
import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api, type Chapter, type UthmaniVerse } from "@/lib/api-client"
import { Loader2, BookOpen } from "lucide-react"

const AUDIO_BASE_URL = "https://verses.quran.foundation/"

export default function Home() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedReciterId, setSelectedReciterId] = useState<number>()
  const [selectedReciterName, setSelectedReciterName] = useState<string>("")
  const [selectedStyle, setSelectedStyle] = useState<string>("")
  const [listeningMode, setListeningMode] = useState<ListeningMode>("chapter")
  const [selectedNumber, setSelectedNumber] = useState<number>()
  const [startVerseKey, setStartVerseKey] = useState<string>("")
  const [totalVerses, setTotalVerses] = useState<number>(0)
  const [firstAudioUrl, setFirstAudioUrl] = useState<string>("")
  const [reciterPath, setReciterPath] = useState<string>("")
  const [uthmaniVerses, setUthmaniVerses] = useState<UthmaniVerse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const data = await api.getChapters()
        setChapters(data)
      } catch (err) {
        console.error("Error loading chapters:", err)
      }
    }
    fetchChapters()
  }, [])

  const handleReciterChange = (reciterId: number, reciterName: string, style: string) => {
    setSelectedReciterId(reciterId)
    setSelectedReciterName(reciterName)
    setSelectedStyle(style)
    setStartVerseKey("")
    setTotalVerses(0)
    setFirstAudioUrl("")
    setReciterPath("")
  }

  const handleModeChange = (mode: ListeningMode) => {
    setListeningMode(mode)
    setSelectedNumber(undefined)
    setStartVerseKey("")
    setTotalVerses(0)
    setFirstAudioUrl("")
  }

  const handleNumberChange = (num: number) => {
    setSelectedNumber(num)
    setStartVerseKey("")
    setTotalVerses(0)
    setFirstAudioUrl("")
  }

  const normalizeUrl = (url: string): string => {
    if (url.startsWith("//")) {
      return `https:${url}`
    }
    return url
  }

  const extractReciterPath = (url: string): string => {
    const fullUrl = normalizeUrl(url)

    const baseUrl = AUDIO_BASE_URL
    const relativePath = fullUrl.replace(baseUrl, "")
    const lastSlashIndex = relativePath.lastIndexOf("/")
    return relativePath.substring(0, lastSlashIndex + 1)
  }

  const handleLoadAudio = async () => {
    if (!selectedReciterId || !selectedNumber) {
      setError("Please select both a reciter and a number")
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (listeningMode === "chapter") {
        const chapter = chapters[selectedNumber - 1]
        if (!chapter) {
          setError("Chapter not found")
          return
        }

        // If we don't have a reciter path yet, fetch one rub to get it
        let pathToUse = reciterPath
        if (!pathToUse) {
          const rubData = await api.getAudioFilesByRub(selectedReciterId, 1)
          if (rubData.audio_files.length > 0) {
            pathToUse = extractReciterPath(rubData.audio_files[0].url)
            setReciterPath(pathToUse)
          }
        }

        // Set up chapter playback
        setStartVerseKey(`${selectedNumber}:1`)
        setTotalVerses(chapter.verses_count)
        const chapterPadded = selectedNumber.toString().padStart(3, "0")
        const versePadded = "001"

        // If pathToUse starts with http:// or https://, it's already a full URL from a different domain
        if (pathToUse.startsWith("http://") || pathToUse.startsWith("https://")) {
          setFirstAudioUrl(`${pathToUse}${chapterPadded}${versePadded}.mp3`)
        } else {
          setFirstAudioUrl(`${AUDIO_BASE_URL}${pathToUse}${chapterPadded}${versePadded}.mp3`)
        }

        const verses = await api.getUthmaniVerses({ chapter_number: selectedNumber })
        setUthmaniVerses(verses)
      } else {
        // Use dedicated endpoints for juz, hizb, and rub
        let audioData

        switch (listeningMode) {
          case "juz":
            audioData = await api.getAudioFilesByJuz(selectedReciterId, selectedNumber)
            break
          case "hizb":
            audioData = await api.getAudioFilesByHizb(selectedReciterId, selectedNumber)
            break
          case "rub":
            audioData = await api.getAudioFilesByRub(selectedReciterId, selectedNumber)
            break
        }

        if (audioData && audioData.audio_files.length > 0) {
          const firstUrl = normalizeUrl(audioData.audio_files[0].url)
          setStartVerseKey(audioData.audio_files[0].verse_key)
          setFirstAudioUrl(firstUrl)

          const path = extractReciterPath(audioData.audio_files[0].url)
          setReciterPath(path)

          setTotalVerses(audioData.pagination.total_records)

          let verses: UthmaniVerse[] = []
          switch (listeningMode) {
            case "juz":
              verses = await api.getUthmaniVerses({ juz_number: selectedNumber })
              break
            case "hizb":
              verses = await api.getUthmaniVerses({ hizb_number: selectedNumber })
              break
            case "rub":
              verses = await api.getUthmaniVerses({ rub_el_hizb_number: selectedNumber })
              break
          }
          setUthmaniVerses(verses)
        }
      }
    } catch (err) {
      console.error("Error loading audio:", err)
      setError("Failed to load audio files. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const canLoadAudio = selectedReciterId && selectedNumber

  const getSelectionText = () => {
    if (!selectedNumber) return ""
    switch (listeningMode) {
      case "juz":
        return `Juz ${selectedNumber}`
      case "hizb":
        return `Hizb ${selectedNumber}`
      case "rub":
        return `Rub ${selectedNumber}`
      case "chapter":
        const chapter = chapters[selectedNumber - 1]
        return chapter ? `${chapter.name_simple}` : `Chapter ${selectedNumber}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            QuranHifz
          </h1>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto text-base md:text-lg">
            Listen to the Holy Quran with your preferred reciter. Choose by Chapter, Juz, Hizb, or Rub.
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Selection card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Select Recitation</CardTitle>
              <CardDescription className="text-base">
                Choose your reciter, listening mode, and segment to begin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ReciterSelector onReciterChange={handleReciterChange} selectedReciterId={selectedReciterId} />

              <RubSelector
                onRubChange={handleNumberChange}
                selectedRub={selectedNumber}
                mode={listeningMode}
                onModeChange={handleModeChange}
                chapters={chapters}
              />

              {selectedReciterName && selectedStyle && (
                <div className="text-sm p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">Selected:</span>
                    <span className="text-foreground">
                      {selectedReciterName} - {selectedStyle}
                      {selectedNumber && ` • ${getSelectionText()}`}
                    </span>
                  </div>
                </div>
              )}

              <Button onClick={handleLoadAudio} disabled={!canLoadAudio || loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading Audio...
                  </>
                ) : (
                  "Load Audio"
                )}
              </Button>

              {error && (
                <div className="text-sm text-destructive p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Player card */}
          {startVerseKey && totalVerses > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Now Playing</CardTitle>
                <CardDescription className="text-base">
                  {selectedReciterName} - {selectedStyle} • {getSelectionText()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AudioPlayer
                  startVerseKey={startVerseKey}
                  totalVerses={totalVerses}
                  baseUrl={AUDIO_BASE_URL}
                  firstAudioUrl={firstAudioUrl}
                  chapters={chapters}
                  uthmaniVerses={uthmaniVerses}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground space-y-2">
          <p className="font-arabic text-lg" style={{ direction: "rtl" }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p>May Allah accept your efforts in listening to His words</p>
        </div>
      </div>
    </div>
  )
}
