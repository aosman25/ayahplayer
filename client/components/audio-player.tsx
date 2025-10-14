"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Loader2, Repeat } from "lucide-react"
import type { Chapter } from "@/lib/api-client"

interface AudioPlayerProps {
  startAyahKey: string
  totalAyahs: number
  baseUrl: string
  firstAudioUrl: string
  chapters: Chapter[]
  onAyahChange?: (ayahKey: string) => void
}

export function AudioPlayer({
  startAyahKey,
  totalAyahs,
  baseUrl,
  firstAudioUrl,
  chapters,
  onAyahChange,
}: AudioPlayerProps) {
  const [startChapter, startAyah] = startAyahKey.split(":").map(Number)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [autoReplay, setAutoReplay] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { actualBaseUrl, relativePath } = useMemo(() => {
    if (!firstAudioUrl) return { actualBaseUrl: baseUrl, relativePath: "" }

    let fullUrl = firstAudioUrl
    if (firstAudioUrl.startsWith("//")) {
      fullUrl = `https:${firstAudioUrl}`
    } else if (!firstAudioUrl.startsWith("http://") && !firstAudioUrl.startsWith("https://")) {
      fullUrl = `${baseUrl}${firstAudioUrl}`
    }

    // Parse the URL to extract base and path
    try {
      const urlObj = new URL(fullUrl)
      const extractedBase = `${urlObj.protocol}//${urlObj.host}/`
      const pathname = urlObj.pathname
      const lastSlashIndex = pathname.lastIndexOf("/")
      const path = pathname.substring(0, lastSlashIndex + 1)

      return { actualBaseUrl: extractedBase, relativePath: path }
    } catch (err) {
      const lastSlashIndex = firstAudioUrl.lastIndexOf("/")
      const path = firstAudioUrl.substring(0, lastSlashIndex + 1)
      return { actualBaseUrl: baseUrl, relativePath: path }
    }
  }, [firstAudioUrl, baseUrl])

  const currentAyahInfo = useMemo(() => {
    let currentChapter = startChapter
    let currentAyah = startAyah + currentIndex

    // Navigate through chapters if we exceed ayah count
    while (currentChapter <= 114 && chapters[currentChapter - 1]) {
      const chapterAyahCount = chapters[currentChapter - 1].verses_count
      if (currentAyah <= chapterAyahCount) {
        break
      }
      currentAyah -= chapterAyahCount
      currentChapter++
    }

    const chapterStr = currentChapter.toString().padStart(3, "0")
    const ayahStr = currentAyah.toString().padStart(3, "0")
    const audioUrl = `${actualBaseUrl}${relativePath}${chapterStr}${ayahStr}.mp3`
    const ayahKey = `${currentChapter}:${currentAyah}`

    return { chapter: currentChapter, ayah: currentAyah, audioUrl, ayahKey }
  }, [currentIndex, startChapter, startAyah, chapters, actualBaseUrl, relativePath])

  // Notify parent component when ayah changes
  useEffect(() => {
    if (onAyahChange && currentAyahInfo.ayahKey) {
      onAyahChange(currentAyahInfo.ayahKey)
    }
  }, [currentAyahInfo.ayahKey, onAyahChange])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setIsLoading(true)
    audio.src = currentAyahInfo.audioUrl
    audio.load()

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          setIsPlaying(false)
          setIsLoading(false)
        })
      }
    }
  }, [currentIndex, currentAyahInfo.audioUrl])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => {
      setIsLoading(false)
    }
    const handleEnded = () => {
      if (currentIndex < totalAyahs - 1) {
        setCurrentIndex((prev) => prev + 1)
        setIsPlaying(true)
      } else if (autoReplay) {
        setCurrentIndex(0)
        setIsPlaying(true)
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [currentIndex, totalAyahs, autoReplay])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch((error) => {
            setIsPlaying(false)
          })
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < totalAyahs - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsPlaying(true)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsPlaying(true)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (value[0] > 0) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleAutoReplay = () => {
    setAutoReplay(!autoReplay)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getChapterName = () => {
    if (chapters.length === 0) return ""
    const chapterIndex = currentAyahInfo.chapter - 1
    if (chapterIndex >= 0 && chapterIndex < chapters.length) {
      return chapters[chapterIndex].name_simple
    }
    return ""
  }

  if (!startAyahKey || totalAyahs === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p className="text-lg">Select a reciter and segment to start listening</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col justify-evenly">
      <audio ref={audioRef} preload="auto" />

      {/* Current ayah info */}
      <div className="text-center space-y-[clamp(0.125rem,0.25vh,0.25rem)]">
        <div className="text-[clamp(0.65rem,1.2vw,0.75rem)] font-medium text-muted-foreground uppercase tracking-wide">Now Playing</div>
        {getChapterName() && <div className="text-[clamp(0.75rem,1.5vw,1rem)] font-bold text-primary">{getChapterName()}</div>}
        <div className="text-[clamp(0.875rem,1.8vw,1.125rem)] font-semibold">Ayah {currentAyahInfo.ayahKey}</div>
        <div className="text-[clamp(0.65rem,1.2vw,0.75rem)] text-muted-foreground">
          Ayah {currentIndex + 1} of {totalAyahs}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-[clamp(0.125rem,0.25vh,0.25rem)]">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
          disabled={isLoading}
        />
        <div className="flex justify-between text-[clamp(0.65rem,1.2vw,0.75rem)] font-medium text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-[clamp(0.375rem,0.75vw,0.75rem)]">
        <Button
          variant="outline"
          size="icon"
          className="h-[clamp(2rem,3.5vw,2.5rem)] w-[clamp(2rem,3.5vw,2.5rem)] bg-transparent"
          onClick={handlePrevious}
          disabled={currentIndex === 0 || isLoading}
        >
          <SkipBack className="h-[clamp(0.875rem,1.5vw,1rem)] w-[clamp(0.875rem,1.5vw,1rem)]" />
        </Button>

        <Button size="icon" className="h-[clamp(2.5rem,4.5vw,3.25rem)] w-[clamp(2.5rem,4.5vw,3.25rem)] shadow-lg" onClick={togglePlayPause} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-[clamp(1rem,1.8vw,1.25rem)] w-[clamp(1rem,1.8vw,1.25rem)] animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-[clamp(1rem,1.8vw,1.25rem)] w-[clamp(1rem,1.8vw,1.25rem)]" />
          ) : (
            <Play className="h-[clamp(1rem,1.8vw,1.25rem)] w-[clamp(1rem,1.8vw,1.25rem)] ml-[clamp(0.1rem,0.2vw,0.2rem)]" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-[clamp(2rem,3.5vw,2.5rem)] w-[clamp(2rem,3.5vw,2.5rem)] bg-transparent"
          onClick={handleNext}
          disabled={currentIndex === totalAyahs - 1 || isLoading}
        >
          <SkipForward className="h-[clamp(0.875rem,1.5vw,1rem)] w-[clamp(0.875rem,1.5vw,1rem)]" />
        </Button>
      </div>

      {/* Volume control with autoreplay button */}
      <div className="flex items-center gap-[clamp(0.375rem,0.75vw,0.75rem)] px-[clamp(0.125rem,0.25vw,0.25rem)]">
        <Button variant="ghost" size="icon" className="shrink-0 h-[clamp(1.75rem,3vw,2.25rem)] w-[clamp(1.75rem,3vw,2.25rem)]" onClick={toggleMute}>
          {isMuted || volume === 0 ? <VolumeX className="h-[clamp(0.875rem,1.5vw,1rem)] w-[clamp(0.875rem,1.5vw,1rem)]" /> : <Volume2 className="h-[clamp(0.875rem,1.5vw,1rem)] w-[clamp(0.875rem,1.5vw,1rem)]" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-full"
        />
        <Button
          variant={autoReplay ? "default" : "outline"}
          size="icon"
          onClick={toggleAutoReplay}
          title={autoReplay ? "Autoreplay enabled" : "Autoreplay disabled"}
          className="shrink-0 h-[clamp(1.75rem,3vw,2.25rem)] w-[clamp(1.75rem,3vw,2.25rem)]"
        >
          <Repeat className="h-[clamp(0.875rem,1.5vw,1rem)] w-[clamp(0.875rem,1.5vw,1rem)]" />
        </Button>
      </div>
    </div>
  )
}
