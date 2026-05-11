import { Playlists } from '../features/playlists.tsx'
import styles from './page-shell.module.css'

export function MyPlaylistsPage() {
    return (
        <section className={styles.shell}>
            <div className={styles.hero}>
                <span className={styles.eyebrow}>Library</span>
                <h2>My playlists</h2>
                <p className={styles.description}>
                    Same structure, same rhythm, no extra decoration. Just a neat page shell for personal collections.
                </p>
            </div>

            <Playlists />
        </section>
    )
}
