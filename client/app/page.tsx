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
  const [startAyahKey, setStartAyahKey] = useState<string>("")
  const [totalAyahs, setTotalAyahs] = useState<number>(0)
  const [firstAudioUrl, setFirstAudioUrl] = useState<string>("")
  const [reciterPath, setReciterPath] = useState<string>("")
  const [uthmaniAyahs, setUthmaniAyahs] = useState<UthmaniVerse[]>([])
  const [currentAyahKey, setCurrentAyahKey] = useState<string>("")
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
    setStartAyahKey("")
    setTotalAyahs(0)
    setFirstAudioUrl("")
    setReciterPath("")
  }

  const handleModeChange = (mode: ListeningMode) => {
    setListeningMode(mode)
    setSelectedNumber(undefined)
    setStartAyahKey("")
    setTotalAyahs(0)
    setFirstAudioUrl("")
  }

  const handleNumberChange = (num: number) => {
    setSelectedNumber(num)
    setStartAyahKey("")
    setTotalAyahs(0)
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
        setStartAyahKey(`${selectedNumber}:1`)
        setTotalAyahs(chapter.verses_count)
        const chapterPadded = selectedNumber.toString().padStart(3, "0")
        const ayahPadded = "001"

        // If pathToUse starts with http:// or https://, it's already a full URL from a different domain
        if (pathToUse.startsWith("http://") || pathToUse.startsWith("https://")) {
          setFirstAudioUrl(`${pathToUse}${chapterPadded}${ayahPadded}.mp3`)
        } else {
          setFirstAudioUrl(`${AUDIO_BASE_URL}${pathToUse}${chapterPadded}${ayahPadded}.mp3`)
        }

        const ayahs = await api.getUthmaniVerses({ chapter_number: selectedNumber })
        setUthmaniAyahs(ayahs)
        setCurrentAyahKey(`${selectedNumber}:1`)
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
          setStartAyahKey(audioData.audio_files[0].verse_key)
          setFirstAudioUrl(firstUrl)

          const path = extractReciterPath(audioData.audio_files[0].url)
          setReciterPath(path)

          setTotalAyahs(audioData.pagination.total_records)

          let ayahs: UthmaniVerse[] = []
          switch (listeningMode) {
            case "juz":
              ayahs = await api.getUthmaniVerses({ juz_number: selectedNumber })
              break
            case "hizb":
              ayahs = await api.getUthmaniVerses({ hizb_number: selectedNumber })
              break
            case "rub":
              ayahs = await api.getUthmaniVerses({ rub_el_hizb_number: selectedNumber })
              break
          }
          setUthmaniAyahs(ayahs)
          if (audioData && audioData.audio_files.length > 0) {
            setCurrentAyahKey(audioData.audio_files[0].verse_key)
          }
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
    <div className="h-screen flex flex-col bg-gradient-to-b from-background to-muted/20 p-4 px-8 md:p-4 md:px-12 lg:p-4 lg:px-16">
      {/* Header */}
      <div className="flex-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg">
        <div className="px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <BookOpen className="h-[clamp(1rem,2vw,1.25rem)] w-[clamp(1rem,2vw,1.25rem)] text-primary" />
            </div>
            <div>
              <h1 className="text-[clamp(1rem,2.5vw,1.5rem)] font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AyahPlayer
              </h1>
              <p className="text-[clamp(0.625rem,1.2vw,0.875rem)] text-muted-foreground">Listen to the Holy Quran Ayah By Ayah</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="h-full flex flex-col gap-[clamp(0.5rem,1.5vh,1rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(0.5rem,1.5vh,1rem)] flex-1 min-h-0">
            {/* Selection Panel */}
            <Card className="shadow-lg overflow-hidden flex flex-col">
              <CardHeader className="py-[clamp(0.375rem,0.75vh,0.5rem)] px-[clamp(0.5rem,1vw,0.75rem)] flex-none">
                <CardTitle className="text-[clamp(0.75rem,1.5vw,1rem)]">Select Recitation</CardTitle>
                <CardDescription className="text-[clamp(0.65rem,1.2vw,0.75rem)]">
                  Choose your reciter, listening mode, and segment to begin
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-y-auto flex-1 p-[clamp(0.5rem,1vw,0.75rem)] flex flex-col">
                <div className="flex-1 flex flex-col justify-evenly gap-[clamp(0.125rem,0.25vh,0.25rem)]">
                  <ReciterSelector onReciterChange={handleReciterChange} selectedReciterId={selectedReciterId} />

                  <RubSelector
                    onRubChange={handleNumberChange}
                    selectedRub={selectedNumber}
                    mode={listeningMode}
                    onModeChange={handleModeChange}
                    chapters={chapters}
                  />

                  {selectedReciterName && selectedStyle && (
                    <div className="text-[clamp(0.65rem,1.2vw,0.75rem)] p-[clamp(0.375rem,0.75vh,0.5rem)] bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-primary">Selected:</span>
                        <span className="text-foreground">
                          {selectedReciterName} - {selectedStyle}
                          {selectedNumber && ` • ${getSelectionText()}`}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button onClick={handleLoadAudio} disabled={!canLoadAudio || loading} className="w-full h-[clamp(1.75rem,3.5vh,2.25rem)] text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    {loading ? (
                      <>
                        <Loader2 className="mr-1.5 h-[clamp(0.875rem,1.5vw,1rem)] w-[clamp(0.875rem,1.5vw,1rem)] animate-spin" />
                        Loading Audio...
                      </>
                    ) : (
                      "Load Audio"
                    )}
                  </Button>

                  {error && (
                    <div className="text-[clamp(0.65rem,1.2vw,0.75rem)] text-destructive p-[clamp(0.375rem,0.75vh,0.5rem)] border border-destructive/50 rounded-lg bg-destructive/5">
                      {error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Player Panel */}
            <Card className="shadow-lg overflow-hidden flex flex-col">
              <CardHeader className="py-[clamp(0.5rem,1vh,0.75rem)] px-[clamp(0.75rem,1.5vw,1rem)] flex-none">
                <CardTitle className="text-[clamp(0.875rem,2vw,1.25rem)]">Now Playing</CardTitle>
                {startAyahKey && totalAyahs > 0 && (
                  <CardDescription className="text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    {selectedReciterName} - {selectedStyle} • {getSelectionText()}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="overflow-y-auto flex-1 p-[clamp(0.75rem,1.5vw,1rem)]">
                {startAyahKey && totalAyahs > 0 ? (
                  <AudioPlayer
                    startAyahKey={startAyahKey}
                    totalAyahs={totalAyahs}
                    baseUrl={AUDIO_BASE_URL}
                    firstAudioUrl={firstAudioUrl}
                    chapters={chapters}
                    onAyahChange={setCurrentAyahKey}
                  />
                ) : (
                  <div className="flex items-center justify-center text-center text-muted-foreground py-[clamp(1rem,2vh,2rem)]">
                    <div>
                      <BookOpen className="h-[clamp(2rem,4vw,3rem)] w-[clamp(2rem,4vw,3rem)] mx-auto mb-[clamp(0.5rem,1vh,0.75rem)] opacity-20" />
                      <p className="text-[clamp(0.875rem,2vw,1.125rem)]">Select a recitation to start</p>
                      <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] mt-2">Choose your reciter and segment from the left panel</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Uthmani Script Display - Full Width Below */}
          <Card className="shadow-lg flex-shrink-0 h-[clamp(8rem,25vh,16rem)]">
            <CardContent className="p-[clamp(0.75rem,1.5vw,1.5rem)] h-full overflow-y-auto flex items-center justify-center">
              {startAyahKey && totalAyahs > 0 && uthmaniAyahs.length > 0 && currentAyahKey ? (
                <div
                  className="text-[clamp(0.875rem,1.8vw,1.25rem)] leading-relaxed text-center font-arabic"
                  style={{ direction: "rtl", fontFamily: "'Amiri Quran', 'Traditional Arabic', serif" }}
                >
                  {uthmaniAyahs.find((v) => v.verse_key === currentAyahKey)?.text_uthmani || ""}
                </div>
              ) : (
                <div className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-muted-foreground text-center">
                  Ayahs will appear here when audio is playing
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
