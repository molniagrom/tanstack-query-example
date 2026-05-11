// import { Playlists } from '../../features/playlists.tsx'
import styles from '../page-shell.module.css'

export function OauthCallbackPage() {
    return (
        <section className={styles.shell}>
            <div className={styles.hero}>
                <span className={styles.eyebrow}>OAuth</span>
                <h2>Callback preview</h2>
                <p className={styles.description}>
                    Temporary page aligned with the rest of the interface so it does not break the visual rhythm.
                </p>
            </div>

            {/*<Playlists />*/}
        </section>
    )
}
