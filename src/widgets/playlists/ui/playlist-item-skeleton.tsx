import styles from './playlists.module.css'
import { Skeleton } from '../../../shared/ui/skeleton'

export const PlaylistItemSkeleton = () => {
    return (
        <li className={styles.item}>
            <Skeleton width={36} height={36} borderRadius="999px" />

            <div className={styles.meta}>
                <Skeleton width="60%" height={18} />
                <Skeleton width="40%" height={16} />
            </div>

            <div className={styles.actions}>
                <Skeleton width={36} height={36} borderRadius="999px" />
                <Skeleton width={36} height={36} borderRadius="999px" />
            </div>

            <Skeleton width={48} height={28} borderRadius="999px" />
        </li>
    )
}
