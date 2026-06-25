import styles from './playlist-tracks.module.css'
import {usePlaylistTracksQuery} from "../api/use-playlist-tracks-query.ts"

type Props = {
    playlistId: string
    isOwner?: boolean
    onPlayTrack?: (track: { id: string; attributes: { attachments: Array<{ url: string }> } }) => void
    onRemoveTrack?: (trackId: string) => void
}

export const PlaylistTracksList = ({playlistId, isOwner, onPlayTrack, onRemoveTrack}: Props) => {
    const {data, isPending, isError, error} = usePlaylistTracksQuery(playlistId)

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

                return (
                    <li key={track.id} className={styles.trackItem}>
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
                                    className={`${styles.actionButton} ${styles.playButton}`}
                                    onClick={() => onPlayTrack?.(track)}
                                    aria-label={`Play ${track.attributes.title}`}
                                    title="Play"
                                >
                                    ▶
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
