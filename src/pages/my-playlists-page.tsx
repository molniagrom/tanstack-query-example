import styles from './page-shell.module.css'
import {useMeQuery} from "../features/auth/api/use-me-query.ts";
import {Navigate} from "@tanstack/react-router";

import {Playlists} from "../widgets/playlists/ui/playlists.tsx";
import {AddPlaylistForm} from "../features/playlist/add-playlist/ui/AddPlaylistForm.tsx";
import {useState} from "react";
import {EditPlaylistForm} from "../features/playlist/edit-playlist/ui/EditPlaylistForm.tsx";

export function MyPlaylistsPage() {

    const {data, isPending} = useMeQuery()
    const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

    if (isPending) {
        return <div>Loading...</div>
    }

    if (!data) {
        return <Navigate to={"/"} replace/>
    }

    return (
        <section className={styles.shell}>
            <div className={styles.hero}>
                <span className={styles.eyebrow}>Library</span>
                <h2>My playlists</h2>
                <p className={styles.description}>
                    Same structure, same rhythm, no extra decoration. Just a neat page shell for personal collections.
                </p>
            </div>

            <hr/>
            <AddPlaylistForm/>
            <hr/>
            <EditPlaylistForm
                key={editingPlaylistId ?? 'closed'}
                playlistId={editingPlaylistId}
                onClose={() => setEditingPlaylistId(null)}
            />
            <Playlists userId={data.userId} onPlaylistSelected={setEditingPlaylistId}/>
        </section>
    )
}
