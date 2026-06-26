import styles from '../account-bar.module.css'
import {useMeQuery} from "../../api/use-me-query.ts";
import {LogoutButton} from "../logout-button.tsx";

export const CurrentUser = () => {

    const query = useMeQuery()

    if (!query.data) return <span className={styles.loadingText}>...</span>

    return (
        <div className={styles.meInfoContainer}>
            <LogoutButton/>
        </div>
    )
}
