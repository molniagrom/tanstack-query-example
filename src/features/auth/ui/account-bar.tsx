import {LoginButton} from "./login-button.tsx";
import {CurrentUser} from "./current-user/current-user.tsx";
import {useMeQuery} from "../api/use-me-query.ts";
import styles from './account-bar.module.css'

export const AccountBar = () => {
    const query = useMeQuery()

    if (query.isPending) return <></>

    return (
        <div className={styles.accountBar}>
            {!query.data && <LoginButton/>}
            {query.data && <CurrentUser/>}
        </div>
    )
}
