
import styles from './page-shell.module.css'
import {Playlists} from "../widgets/playlists/ui/playlists.tsx";

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

            <Playlists isSearchActive={true}/>
        </section>
    )
}

export default PlaylistsPage
