import styles from './page-shell.module.css'
import {Tracks} from "../widgets/tracks/ui/tracks.tsx";

function TracksPage() {
    return (
        <section className={styles.shell}>
            <div className={styles.hero}>
                <span className={styles.eyebrow}>Browse</span>
                <h2>All Tracks</h2>
                <p className={styles.description}>
                    Discover music from all playlists. Search, sort, and play your favorite tracks.
                </p>
            </div>

            <Tracks />
        </section>
    )
}

export default TracksPage
