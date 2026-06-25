import styles from './page-shell.module.css'
import {useParams} from "@tanstack/react-router";
import {usePlaylistQuery} from "../features/playlist/edit-playlist/api/use-playlist-query.tsx";
import {useMeQuery} from "../features/auth/api/use-me-query.ts";
import {PlaylistTracksList} from "../features/playlist-tracks/ui/PlaylistTracksList.tsx";
import {LikeDislikePlaylist} from "../features/playlist/like-playlist/ui/LikeDislikePlaylist.tsx";
import {useState} from "react";
import {EditPlaylistForm} from "../features/playlist/edit-playlist/ui/EditPlaylistForm.tsx";
import {usePlayer} from "../features/player/model/use-player-store.tsx";

function PlaylistDetailPage() {
    const {playlistId} = useParams({from: '/playlist/$playlistId'})
    const {data: playlist, isPending, isError} = usePlaylistQuery(playlistId)
    const {data: me} = useMeQuery()
    const [isEditing, setIsEditing] = useState(false)
    const {play} = usePlayer()

    if (isPending) {
        return <section className={styles.shell}><div className={styles.description}>Loading...</div></section>
    }

    if (isError || !playlist) {
        return <section className={styles.shell}><div className={styles.description}>Playlist not found</div></section>
    }

    const attrs = playlist.data.attributes
    const isOwner = me?.userId === attrs.user.id

    const handlePlayTrack = (track: { id: string; attributes: { title: string; attachments: Array<{ url: string }>; images: { main?: Array<{ url: string }> }; user: { name: string } } }) => {
        play({
            id: track.id,
            title: track.attributes.title,
            artist: track.attributes.user.name,
            coverUrl: track.attributes.images.main?.[0]?.url,
            audioUrl: track.attributes.attachments[0]?.url,
        })
    }

    return (
        <section className={styles.shell}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.eyebrow}>Playlist</span>
                    <h2>{attrs.title}</h2>
                    <p className={styles.description}>
                        {attrs.description || "No description"}
                    </p>
                    <p className={styles.description}>
                        by {attrs.user.name} • {attrs.tracksCount} tracks • {Math.floor(attrs.duration / 60)} min
                    </p>
                </div>
                {isOwner && (
                    <button type="button" className={styles.heroButton} onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                )}
            </div>

            <LikeDislikePlaylist
                playlistId={playlistId}
                currentUserReaction={attrs.currentUserReaction}
                likesCount={attrs.likesCount}
                dislikesCount={attrs.dislikesCount}
            />

            <PlaylistTracksList
                playlistId={playlistId}
                isOwner={isOwner}
                onPlayTrack={handlePlayTrack}
            />

            <EditPlaylistForm
                playlistId={isEditing ? playlistId : null}
                onClose={() => setIsEditing(false)}
            />
        </section>
    )
}

export default PlaylistDetailPage
