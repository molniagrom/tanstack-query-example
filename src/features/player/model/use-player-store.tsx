import {createContext, useCallback, useContext, useRef, useState, type ReactNode} from "react"

type Track = {
    id: string
    title: string
    artist?: string
    coverUrl?: string
    audioUrl: string
}

type RepeatMode = "off" | "all" | "one"

type PlayerContextValue = {
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

const PlayerContext = createContext<PlayerContextValue | null>(null)

export const usePlayer = () => {
    const ctx = useContext(PlayerContext)
    if (!ctx) throw new Error("usePlayer must be used within PlayerProvider")
    return ctx
}

export const PlayerProvider = ({children}: {children: ReactNode}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolumeState] = useState(1)
    const [queue, setQueue] = useState<Track[]>([])
    const queueIndexRef = useRef(-1)
    const [isShuffle, setIsShuffle] = useState(false)
    const [repeatMode, setRepeatMode] = useState<RepeatMode>("off")
    const repeatModeRef = useRef<RepeatMode>("off")

    const toggleShuffle = useCallback(() => {
        setIsShuffle(prev => !prev)
    }, [])

    const cycleRepeat = useCallback(() => {
        setRepeatMode(prev => {
            const next = prev === "off" ? "all" : prev === "all" ? "one" : "off"
            repeatModeRef.current = next
            return next
        })
    }, [])

    const getAudio = useCallback(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio()
            audioRef.current.addEventListener("timeupdate", () => {
                setCurrentTime(audioRef.current?.currentTime ?? 0)
            })
            audioRef.current.addEventListener("loadedmetadata", () => {
                setDuration(audioRef.current?.duration ?? 0)
            })
            audioRef.current.addEventListener("ended", () => {
                const currentRepeat = repeatModeRef.current
                if (currentRepeat === "one") {
                    if (audioRef.current) {
                        audioRef.current.currentTime = 0
                        audioRef.current.play().catch(() => {})
                    }
                    return
                }
                setIsPlaying(false)
                const prevIdx = queueIndexRef.current
                const nextIdx = prevIdx + 1
                setQueue(q => {
                    if (nextIdx < q.length) {
                        const nextTrack = q[nextIdx]
                        if (audioRef.current) {
                            audioRef.current.src = nextTrack.audioUrl
                            audioRef.current.play().catch(() => {})
                        }
                        setCurrentTrack(nextTrack)
                        setIsPlaying(true)
                    } else if (currentRepeat === "all" && q.length > 0) {
                        const firstTrack = q[0]!
                        if (audioRef.current) {
                            audioRef.current.src = firstTrack.audioUrl
                            audioRef.current.play().catch(() => {})
                        }
                        setCurrentTrack(firstTrack)
                        setIsPlaying(true)
                        queueIndexRef.current = 0
                        return q
                    }
                    return q
                })
                queueIndexRef.current = nextIdx
            })
            audioRef.current.volume = volume
        }
        return audioRef.current
    }, [volume])

    const play = useCallback((track: Track, newQueue?: Track[]) => {
        const audio = getAudio()
        audio.src = track.audioUrl
        audio.play().catch(() => {})

        if (newQueue) {
            setQueue(newQueue)
            const idx = newQueue.findIndex(t => t.id === track.id)
            queueIndexRef.current = idx >= 0 ? idx : 0
        } else {
            setQueue([track])
            queueIndexRef.current = 0
        }

        setCurrentTrack(track)
        setIsPlaying(true)
    }, [getAudio])

    const pause = useCallback(() => {
        audioRef.current?.pause()
        setIsPlaying(false)
    }, [])

    const resume = useCallback(() => {
        audioRef.current?.play().catch(() => {})
        setIsPlaying(true)
    }, [])

    const toggle = useCallback(() => {
        if (isPlaying) {
            pause()
        } else {
            resume()
        }
    }, [isPlaying, pause, resume])

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time
        }
    }, [])

    const setVolume = useCallback((v: number) => {
        setVolumeState(v)
        if (audioRef.current) {
            audioRef.current.volume = v
        }
    }, [])

    const next = useCallback(() => {
        const prevIdx = queueIndexRef.current
        let nextIdx: number
        if (isShuffle && queue.length > 1) {
            do {
                nextIdx = Math.floor(Math.random() * queue.length)
            } while (nextIdx === prevIdx)
        } else {
            nextIdx = prevIdx + 1
        }
        if (nextIdx < queue.length) {
            const track = queue[nextIdx]
            if (audioRef.current) {
                audioRef.current.src = track.audioUrl
                audioRef.current.play().catch(() => {})
            }
            setCurrentTrack(track)
            setIsPlaying(true)
        }
        queueIndexRef.current = nextIdx
    }, [queue, isShuffle])

    const prev = useCallback(() => {
        const prevIdx = queueIndexRef.current
        let newIdx: number
        if (isShuffle && queue.length > 1) {
            do {
                newIdx = Math.floor(Math.random() * queue.length)
            } while (newIdx === prevIdx)
        } else {
            newIdx = prevIdx - 1
        }
        if (newIdx >= 0 && newIdx < queue.length) {
            const track = queue[newIdx]
            if (audioRef.current) {
                audioRef.current.src = track.audioUrl
                audioRef.current.play().catch(() => {})
            }
            setCurrentTrack(track)
            setIsPlaying(true)
        }
        queueIndexRef.current = newIdx
    }, [queue, isShuffle])

    return (
        <PlayerContext.Provider value={{
            currentTrack, isPlaying, currentTime, duration, volume, queue,
            isShuffle, repeatMode,
            play, pause, resume, toggle, seek, setVolume, next, prev,
            toggleShuffle, cycleRepeat,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}
