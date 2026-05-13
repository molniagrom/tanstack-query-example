import styles from '../page-shell.module.css'
import {useEffect} from "react";

export function OauthCallbackPage() {
    useEffect(() => {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code")

        if (code && window.opener) {
            window.opener.postMessage({code}, window.location.origin)
        }
        window.close()
    }, [])

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
