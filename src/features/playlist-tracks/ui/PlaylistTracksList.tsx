import styles from './playlist-tracks.module.css'
import {usePlaylistTracksQuery} from "../api/use-playlist-tracks-query.ts"
import {usePlayer} from "../../player/model/use-player-store"

type Props = {
    playlistId: string
    isOwner?: boolean
    onRemoveTrack?: (trackId: string) => void
}

export const PlaylistTracksList = ({playlistId, isOwner, onRemoveTrack}: Props) => {
    const {data, isPending, isError, error} = usePlaylistTracksQuery(playlistId)
    const {currentTrack, isPlaying, play, toggle} = usePlayer()

    if (isPending) {
        return <div className={styles.emptyState}>Loading tracks...</div>
    }

    if (isError) {
        return <div className={styles.emptyState}>{error?.message ?? "Failed to load tracks"}</div>
    }

    const tracks = data?.data ?? []

    if (tracks.length === 0) {
        return <div className={styles.emptyState}>No tracks in this playlist yet</div>
    }

    return (
        <ol className={styles.trackList}>
            {tracks.map((track, index) => {
                const coverUrl = track.attributes.images.main?.[0]?.url
                const audioUrl = track.attributes.attachments?.[0]?.url
                const isCurrentTrack = currentTrack?.id === track.id

                const handlePlayClick = () => {
                    if (isCurrentTrack) {
                        toggle()
                    } else if (audioUrl) {
                        play({
                            id: track.id,
                            title: track.attributes.title,
                            coverUrl,
                            audioUrl,
                        }, tracks.map(t => ({
                            id: t.id,
                            title: t.attributes.title,
                            coverUrl: t.attributes.images.main?.[0]?.url,
                            audioUrl: t.attributes.attachments?.[0]?.url ?? "",
                        })))
                    }
                }

                return (
                    <li key={track.id} className={`${styles.trackItem} ${isCurrentTrack ? styles.trackItemActive : ""}`}>
                        <span className={styles.trackIndex}>{String(index + 1).padStart(2, '0')}</span>

                        {coverUrl ? (
                            <img src={coverUrl} alt={track.attributes.title} className={styles.trackCover} />
                        ) : (
                            <div className={styles.trackCoverPlaceholder}>♪</div>
                        )}

                        <div className={styles.trackMeta}>
                            <span className={styles.trackTitle}>{track.attributes.title}</span>
                            <span className={styles.trackArtist}>
                                {track.attributes.publishedAt ? "Published" : "Draft"}
                            </span>
                        </div>

                        <div className={styles.trackActions}>
                            {audioUrl && (
                                <button
                                    type="button"
                                    className={`${styles.actionButton} ${styles.playButton} ${isCurrentTrack && isPlaying ? styles.playButtonActive : ""}`}
                                    onClick={handlePlayClick}
                                    aria-label={`${isCurrentTrack && isPlaying ? "Pause" : "Play"} ${track.attributes.title}`}
                                    title={isCurrentTrack && isPlaying ? "Pause" : "Play"}
                                >
                                    {isCurrentTrack && isPlaying ? "⏸" : "▶"}
                                </button>
                            )}
                            {isOwner && (
                                <button
                                    type="button"
                                    className={`${styles.actionButton} ${styles.removeButton}`}
                                    onClick={() => onRemoveTrack?.(track.id)}
                                    aria-label={`Remove ${track.attributes.title}`}
                                    title="Remove from playlist"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </li>
                )
            })}
        </ol>
    )
}
