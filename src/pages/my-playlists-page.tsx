import { Playlists } from '../features/playlists.tsx'
import styles from './page-shell.module.css'
import {useMeQuery} from "../features/auth/api/use-me-query.ts";
import {Navigate} from "@tanstack/react-router";

export function MyPlaylistsPage() {

    const {data, isPending} = useMeQuery()

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

            <Playlists userId={data.userId}/>
        </section>
    )
}
