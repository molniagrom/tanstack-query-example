import styles from './page-shell.module.css'
import {useMeQuery} from "../features/auth/api/use-me-query.ts";
import {Navigate} from "@tanstack/react-router";

import {Playlists} from "../widgets/playlists/ui/playlists.tsx";
import {AddPlaylistForm} from "../features/playlist/add-playlist/ui/AddPlaylistForm.tsx";
import {useState} from "react";
import {EditPlaylistForm} from "../features/playlist/edit-playlist/ui/EditPlaylistForm.tsx";

export function MyPlaylistsPage() {

    const {data, isPending} = useMeQuery()
    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false)
    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

    if (isPending) {
        return <div>Loading...</div>
    }

    if (!data) {
        return <Navigate to={"/"} replace/>
    }

    const handlePlaylistDelete = ( playlistId: string ) => {
        if (playlistId === editingPlaylistId) {
            setEditingPlaylistId(null)
        }
    }

    return (
        <section className={styles.shell}>
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.eyebrow}>Library</span>
                    <h2>My playlists</h2>
                    <p className={styles.description}>
                        Same structure, same rhythm, no extra decoration. Just a neat page shell for personal collections.
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.heroButton}
                    onClick={() => setIsAddPlaylistOpen(true)}
                >
                    + add playlist
                </button>
            </div>

            <div className={styles.divider} aria-hidden="true"/>
            <AddPlaylistForm
                isOpen={isAddPlaylistOpen}
                onClose={() => setIsAddPlaylistOpen(false)}
            />
            <div className={styles.divider} aria-hidden="true"/>
            <EditPlaylistForm
                key={editingPlaylistId ?? 'closed'}
                playlistId={editingPlaylistId}
                onClose={() => setEditingPlaylistId(null)}
            />
            <Playlists
                userId={data.userId}
                onPlaylistSelected={(playlistId) => setEditingPlaylistId(playlistId)}
                onPlaylistDeleted={handlePlaylistDelete}

            />
        </section>
    )
}
