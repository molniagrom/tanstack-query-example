import {Link} from "@tanstack/react-router";
import styles from '../account-bar.module.css'
import {useMeQuery} from "../../api/use-me-query.ts";

export const CurrentUser = () => {

    const query = useMeQuery()

    if (!query.data) return <span className={styles.loadingText}>...</span>

    return (
        <div className={styles.meInfoContainer}>
            <Link to="/my-playlists" activeOptions={{exact: true}} className={styles.userLink}>
                {query.data!.login}
            </Link>
        </div>
    )
}
