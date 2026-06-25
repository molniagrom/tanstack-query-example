import {createContext, useCallback, useContext, useRef, useState, type ReactNode} from "react"

type Track = {
    id: string
    title: string
    artist?: string
    coverUrl?: string
    audioUrl: string
}

type PlayerContextValue = {
    currentTrack: Track | null
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
    queue: Track[]
    play: (track: Track, queue?: Track[]) => void
    pause: () => void
    resume: () => void
    toggle: () => void
    seek: (time: number) => void
    setVolume: (volume: number) => void
    next: () => void
    prev: () => void
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
    const [queueIndex, setQueueIndex] = useState(-1)

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
                setIsPlaying(false)
                // Auto-advance to next track
                setQueueIndex(prev => {
                    const nextIdx = prev + 1
                    setQueue(q => {
                        if (nextIdx < q.length) {
                            const nextTrack = q[nextIdx]
                            if (audioRef.current) {
                                audioRef.current.src = nextTrack.audioUrl
                                audioRef.current.play().catch(() => {})
                            }
                            setCurrentTrack(nextTrack)
                            setIsPlaying(true)
                        }
                        return q
                    })
                    return nextIdx
                })
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
            setQueueIndex(idx >= 0 ? idx : 0)
        } else {
            setQueue([track])
            setQueueIndex(0)
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
        setQueueIndex(prev => {
            const nextIdx = prev + 1
            if (nextIdx < queue.length) {
                const track = queue[nextIdx]
                if (audioRef.current) {
                    audioRef.current.src = track.audioUrl
                    audioRef.current.play().catch(() => {})
                }
                setCurrentTrack(track)
                setIsPlaying(true)
            }
            return nextIdx
        })
    }, [queue])

    const prev = useCallback(() => {
        setQueueIndex(prev => {
            const prevIdx = prev - 1
            if (prevIdx >= 0) {
                const track = queue[prevIdx]
                if (audioRef.current) {
                    audioRef.current.src = track.audioUrl
                    audioRef.current.play().catch(() => {})
                }
                setCurrentTrack(track)
                setIsPlaying(true)
            }
            return prevIdx
        })
    }, [queue])

    return (
        <PlayerContext.Provider value={{
            currentTrack, isPlaying, currentTime, duration, volume, queue,
            play, pause, resume, toggle, seek, setVolume, next, prev,
        }}>
            {children}
        </PlayerContext.Provider>
    )
}
