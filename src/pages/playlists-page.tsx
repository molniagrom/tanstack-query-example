import { Playlists } from '../features/playlists/ui/playlists.tsx'
import styles from './page-shell.module.css'

function PlaylistsPage() {
    return (
        <section className={styles.shell}>
            <div className={styles.hero}>
                <span className={styles.eyebrow}>Discover</span>
                <h2>Public playlists</h2>
                <p className={styles.description}>
                    Clean overview of the latest playlists with consistent spacing and a quieter visual hierarchy.
                </p>
            </div>

            <Playlists />
        </section>
    )
}

export default PlaylistsPage
