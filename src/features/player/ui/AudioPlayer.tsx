import styles from './audio-player.module.css'
import {usePlayer} from "../model/use-player-store.tsx"

const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

export const AudioPlayer = () => {
    const {
        currentTrack, isPlaying, currentTime, duration, volume,
        isShuffle, repeatMode,
        toggle, seek, setVolume, next, prev,
        toggleShuffle, cycleRepeat,
    } = usePlayer()

    const handleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            document.documentElement.requestFullscreen()
        }
    }

    const repeatLabel = repeatMode === "one" ? "Repeat One" : repeatMode === "all" ? "Repeat All" : "Repeat Off"
    const repeatIcon = repeatMode === "one" ? "🔂" : "🔁"

    if (!currentTrack) {
        return (
            <div className={styles.emptyPlayer}>
                Select a track to start playing
            </div>
        )
    }

    return (
        <div className={styles.playerBar}>
            <div className={styles.trackInfo}>
                {currentTrack.coverUrl ? (
                    <img src={currentTrack.coverUrl} alt={currentTrack.title} className={styles.cover} />
                ) : (
                    <div className={styles.coverPlaceholder}>♪</div>
                )}
                <div className={styles.trackText}>
                    <span className={styles.trackTitle}>{currentTrack.title}</span>
                    <span className={styles.trackArtist}>{currentTrack.artist ?? "Unknown"}</span>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.controlButtons}>
                    <button
                        type="button"
                        className={`${styles.controlBtn} ${isShuffle ? styles.controlBtnActive : ""}`}
                        onClick={toggleShuffle}
                        title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                    >
                        🔀
                    </button>
                    <button type="button" className={styles.controlBtn} onClick={prev} title="Previous">⏮</button>
                    <button
                        type="button"
                        className={`${styles.controlBtn} ${styles.playPauseBtn}`}
                        onClick={toggle}
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? "⏸" : "▶"}
                    </button>
                    <button type="button" className={styles.controlBtn} onClick={next} title="Next">⏭</button>
                    <button
                        type="button"
                        className={`${styles.controlBtn} ${repeatMode !== "off" ? styles.controlBtnActive : ""}`}
                        onClick={cycleRepeat}
                        title={repeatLabel}
                    >
                        {repeatIcon}
                    </button>
                </div>
                <div className={styles.progressRow}>
                    <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        className={styles.progressSlider}
                        min={0}
                        max={duration || 0}
                        value={currentTime}
                        onChange={e => seek(Number(e.target.value))}
                    />
                    <span className={styles.timeLabel}>{formatTime(duration)}</span>
                </div>
            </div>

            <div className={styles.volumeRow}>
                <span className={styles.volumeLabel}>🔊</span>
                <input
                    type="range"
                    className={styles.volumeSlider}
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                />
                <button
                    type="button"
                    className={styles.controlBtn}
                    onClick={handleFullscreen}
                    title="Fullscreen"
                >
                    ⛶
                </button>
            </div>
        </div>
    )
}
