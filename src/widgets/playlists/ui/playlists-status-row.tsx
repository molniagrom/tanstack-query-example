import styles from './playlists.module.css'

type Props = {
    isFetching: boolean
    onRefresh: () => void
}

export const PlaylistsStatusRow = ({ isFetching, onRefresh }: Props) => {
    return (
        <div className={styles.statusRow}>
            <button
                type="button"
                className={styles.refreshButton}
                onClick={onRefresh}
                disabled={isFetching}
            >
                Refresh
            </button>

            {isFetching && (
                <div className={styles.statusBadge} aria-live="polite">
                    <span className={styles.statusDot} aria-hidden="true" />
                    Updating
                </div>
            )}
        </div>
    )
}
