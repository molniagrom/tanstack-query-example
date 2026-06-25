import {createContext, useContext} from "react"

export type Track = {
    id: string
    title: string
    artist?: string
    coverUrl?: string
    audioUrl: string
}

export type RepeatMode = "off" | "all" | "one"

export type PlayerContextValue = {
    currentTrack: Track | null
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
    queue: Track[]
    isShuffle: boolean
    repeatMode: RepeatMode
    play: (track: Track, queue?: Track[]) => void
    pause: () => void
    resume: () => void
    toggle: () => void
    seek: (time: number) => void
    setVolume: (volume: number) => void
    next: () => void
    prev: () => void
    toggleShuffle: () => void
    cycleRepeat: () => void
}

export const PlayerContext = createContext<PlayerContextValue | null>(null)

export const usePlayer = () => {
    const ctx = useContext(PlayerContext)
    if (!ctx) throw new Error("usePlayer must be used within PlayerProvider")
    return ctx
}

