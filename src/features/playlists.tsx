import { useQuery } from '@tanstack/react-query'
import { client } from '../shared/api/client.ts'
import styles from './playlists.module.css'

export const Playlists = () => {
    const query = useQuery({
        staleTime: 20000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        queryKey: ['playlists'],
        queryFn: async () => {
            const response = await client.GET('/playlists' as unknown as "/playlists")
            if (response.error) {
                throw (response as unknown as {error: Error}).error;
            }
            return response.data;
        }
    })

    const playlists = query.data?.data ?? []

    if (query.isPending) {
        return <div className={styles.stateCard}>Loading playlists...</div>
    }

    if (query.isError) {
        return (
            <div className={`${styles.stateCard} ${styles.stateCardError}`}>
                Error: {query.error.message}
            </div>
        )
    }

    if (playlists.length === 0) {
        return <div className={styles.stateCard}>No playlists yet.</div>
    }

    return (
        <section className={styles.section}>
            <div className={styles.statusRow}>
                <button
                    type="button"
                    className={styles.refreshButton}
                    onClick={() => void query.refetch()}
                    disabled={query.isFetching}
                >
                    Refresh
                </button>

                {query.isFetching && (
                    <div className={styles.statusBadge} aria-live="polite">
                        <span className={styles.statusDot} aria-hidden="true" />
                        Updating
                    </div>
                )}
            </div>

            <ol className={styles.list}>
                {playlists.map((playlist, index) => {
                    const tagsCount = playlist.attributes.tags?.length ?? 0
                    const authorName = playlist.attributes.user?.name ?? 'Unknown author'

                    return (
                        <li key={playlist.id} className={styles.item}>
                            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>

                            <div className={styles.meta}>
                                <span className={styles.title}>{playlist.attributes.title}</span>
                                <span className={styles.subtitle}>
                                    {authorName} • {tagsCount} {tagsCount === 1 ? 'tag' : 'tags'}
                                </span>
                            </div>

                            <span className={styles.badge}>#{playlist.attributes.order}</span>
                        </li>
                    )
                })}
            </ol>
        </section>
    )
}
