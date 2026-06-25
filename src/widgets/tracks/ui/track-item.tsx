import {Link} from "@tanstack/react-router";
import styles from './tracks.module.css'
import {LikeDislikeTrack} from "../../../features/track/like-track/ui/LikeDislikeTrack.tsx"

type TrackImages = {
    main?: Array<{ type: string; url: string; width: number; height: number }>
}

type TrackAttachment = {
    id: string
    url: string
    contentType: string
    originalName: string
    fileSize: number
}

type TrackArtist = {
    id: string
    type: string
    attributes: { name: string }
}

export type TrackItem = {
    id: string
    type: string
    attributes: {
        title: string
        addedAt: string
        likesCount: number
        attachments: TrackAttachment[]
        images: TrackImages
        user: { id: string; name: string }
        currentUserReaction: 0 | 1 | -1
        isPublished: boolean
        publishedAt?: string | null
        duration: number
    }
    relationships?: {
        artists: { data: Array<{ id: string; type: string }> }
    }
}

type Props = {
    track: TrackItem
    index: number
    artists?: TrackArtist[]
    onPlay: (track: TrackItem) => void
}

const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

export const TrackItem = ({track, index, artists, onPlay}: Props) => {
    const coverUrl = track.attributes.images.main?.[0]?.url
    const trackArtists = track.relationships?.artists.data
        .map(a => artists?.find(ar => ar.id === a.id)?.attributes.name)
        .filter(Boolean)
        .join(", ")

    return (
        <li className={styles.item}>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>

            <Link to="/track/$trackId" params={{trackId: track.id}} style={{display: "contents"}}>
                {coverUrl ? (
                    <img src={coverUrl} alt={track.attributes.title} className={styles.cover} />
                ) : (
                    <div className={styles.coverPlaceholder}>♪</div>
                )}

                <div className={styles.meta}>
                    <span className={styles.title}>{track.attributes.title}</span>
                    <span className={styles.subtitle}>
                        {trackArtists || track.attributes.user.name}
                        {!track.attributes.isPublished && " • Draft"}
                    </span>
                </div>
            </Link>

            <div className={styles.actions}>
                <LikeDislikeTrack
                    trackId={track.id}
                    currentUserReaction={track.attributes.currentUserReaction}
                    likesCount={track.attributes.likesCount}
                />
                <button
                    type="button"
                    className={styles.playButton}
                    onClick={() => onPlay(track)}
                    aria-label={`Play ${track.attributes.title}`}
                    title="Play"
                >
                    ▶
                </button>
            </div>

            <span className={styles.duration}>{formatDuration(track.attributes.duration)}</span>
        </li>
    )
}
