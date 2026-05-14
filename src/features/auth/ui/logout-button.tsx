import styles from './account-bar.module.css'
import {useLogoutMutation} from "../api/useLogoutMutation.ts";

export const LogoutButton = () => {

    const mutation = useLogoutMutation()

    const handleLoginClick = () => {
        mutation.mutate()
    }

    return (
        <button className={styles.logoutButton} onClick={handleLoginClick} disabled={mutation.isPending}>
            Logout with APIHUB
        </button>
    )
}
