import styles from './page-shell.module.css'
import {useParams} from "@tanstack/react-router";
import {useTrackDetailsQuery} from "../features/track/edit-track/api/use-track-details-query.ts";
import {useMeQuery} from "../features/auth/api/use-me-query.ts";
import {LikeDislikeTrack} from "../features/track/like-track/ui/LikeDislikeTrack.tsx";
import {useState} from "react";
import {EditTrackForm} from "../features/track/edit-track/ui/EditTrackForm.tsx";
import {usePlayer} from "../features/player/model/use-player-store.tsx";

function TrackDetailPage() {
    const {trackId} = useParams({from: '/track/$trackId'})
    const {data, isPending, isError} = useTrackDetailsQuery(trackId)
    const {data: me} = useMeQuery()
    const [isEditing, setIsEditing] = useState(false)
    const {play, isPlaying, currentTrack, toggle} = usePlayer()

    if (isPending) {
        return <section className={styles.shell}><div className={styles.description}>Loading...</div></section>
    }

    if (isError || !data) {
        return <section className={styles.shell}><div className={styles.description}>Track not found</div></section>
    }

    const attrs = data.data.attributes
    const isOwner = me?.userId === attrs.user.id
    const audioUrl = attrs.attachments?.[0]?.url
    const coverUrl = attrs.images.main?.[0]?.url
    const isCurrentlyPlaying = currentTrack?.id === trackId

    const handlePlay = () => {
        if (!audioUrl) return
        if (isCurrentlyPlaying) {
            toggle()
        } else {
            play({
                id: trackId,
                title: attrs.title,
                artist: attrs.artists?.[0]?.name ?? attrs.user.name,
                coverUrl,
                audioUrl,
            })
        }
    }

    return (
        <section className={styles.shell}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.eyebrow}>Track</span>
                    <h2>{attrs.title}</h2>
                    <p className={styles.description}>
                        {attrs.artists?.map(a => a.name).join(", ") || attrs.user.name}
                        {attrs.releaseDate && ` • ${new Date(attrs.releaseDate).getFullYear()}`}
                        {` • ${Math.floor(attrs.duration / 60)}:${String(attrs.duration % 60).padStart(2, '0')}`}
                    </p>
                    {!attrs.isPublished && (
                        <p className={styles.description} style={{color: "var(--text-soft)"}}>Draft</p>
                    )}
                </div>
                <div style={{display: "flex", gap: 8}}>
                    {audioUrl && (
                        <button type="button" className={styles.heroButton} onClick={handlePlay}>
                            {isCurrentlyPlaying && isPlaying ? "Pause" : "Play"}
                        </button>
                    )}
                    {isOwner && (
                        <button type="button" className={styles.heroButton} onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                    )}
                </div>
            </div>

            {coverUrl && (
                <img src={coverUrl} alt={attrs.title} style={{width: 200, height: 200, borderRadius: 16, objectFit: "cover"}} />
            )}

            <LikeDislikeTrack
                trackId={trackId}
                currentUserReaction={attrs.currentUserReaction}
                likesCount={attrs.likesCount}
            />

            {attrs.lyrics && (
                <div style={{whiteSpace: "pre-wrap", lineHeight: 1.6, padding: "16px 0"}}>
                    {attrs.lyrics}
                </div>
            )}

            {attrs.tags.length > 0 && (
                <div style={{display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 0"}}>
                    {attrs.tags.map(tag => (
                        <span key={tag.id} style={{padding: "4px 12px", borderRadius: 999, background: "rgba(229, 169, 60, 0.12)", fontSize: "0.82rem"}}>
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}

            <EditTrackForm
                trackId={isEditing ? trackId : null}
                onClose={() => setIsEditing(false)}
            />
        </section>
    )
}

export default TrackDetailPage
