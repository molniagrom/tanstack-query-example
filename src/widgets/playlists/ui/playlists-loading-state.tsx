import styles from './playlists.module.css'
import { Loader } from '../../../shared/ui/loader'

export const PlaylistsLoadingState = () => {
    return (
        <div className={styles.stateCard}>
            <div className={styles.loadingContainer}>
                <Loader size="medium" />
                <span>Loading playlists...</span>
            </div>
        </div>
    )
}
