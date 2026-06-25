import {Link} from "@tanstack/react-router";
import styles from './tracks.module.css'
import {LikeDislikeTrack} from "../../../features/track/like-track/ui/LikeDislikeTrack.tsx"
import {usePlayer} from "../../../features/player/model/use-player-store"

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
    queue?: TrackItem[]
}

const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
}

export const TrackItem = ({track, index, artists, queue}: Props) => {
    const {currentTrack, isPlaying, play, toggle} = usePlayer()
    const coverUrl = track.attributes.images.main?.[0]?.url
    const audioUrl = track.attributes.attachments?.[0]?.url
    const trackArtists = track.relationships?.artists.data
        .map(a => artists?.find(ar => ar.id === a.id)?.attributes.name)
        .filter(Boolean)
        .join(", ")

    const isCurrentTrack = currentTrack?.id === track.id

    const handleClick = () => {
        if (isCurrentTrack) {
            toggle()
        } else if (audioUrl) {
            const trackQueue = (queue ?? []).map(t => ({
                id: t.id,
                title: t.attributes.title,
                artist: t.relationships?.artists.data
                    .map(a => artists?.find(ar => ar.id === a.id)?.attributes.name)
                    .filter(Boolean)
                    .join(", ") || t.attributes.user.name,
                coverUrl: t.attributes.images.main?.[0]?.url,
                audioUrl: t.attributes.attachments?.[0]?.url ?? "",
            }))
            play({
                id: track.id,
                title: track.attributes.title,
                artist: trackArtists || track.attributes.user.name,
                coverUrl,
                audioUrl,
            }, trackQueue.length > 0 ? trackQueue : undefined)
        }
    }

    return (
        <li className={`${styles.item} ${isCurrentTrack ? styles.itemActive : ""}`}>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>

            <Link to="/track-detail/$trackId" params={{trackId: track.id}} style={{display: "contents"}}>
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
                {audioUrl && (
                    <button
                        type="button"
                        className={`${styles.playButton} ${isCurrentTrack && isPlaying ? styles.playButtonActive : ""}`}
                        onClick={handleClick}
                        aria-label={`${isCurrentTrack && isPlaying ? "Pause" : "Play"} ${track.attributes.title}`}
                        title={isCurrentTrack && isPlaying ? "Pause" : "Play"}
                    >
                        {isCurrentTrack && isPlaying ? "⏸" : "▶"}
                    </button>
                )}
            </div>

            <span className={styles.duration}>{formatDuration(track.attributes.duration)}</span>
        </li>
    )
}
