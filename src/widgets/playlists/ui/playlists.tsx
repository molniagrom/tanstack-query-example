import {keepPreviousData, useQuery} from '@tanstack/react-query'
import {client} from '../../../shared/api/client.ts'
import styles from './playlists.module.css'
import {Pagination} from "../../../shared/ui/pagination";
import {useState} from "react";
import {DeletePlaylist} from "../../../features/playlist/delete-playlist/ui/delete-playlist.tsx";

type Props = {
    userId?: string
    onPlaylistSelected?: (playlistId: string) => void
}

export const Playlists = ({userId, onPlaylistSelected}: Props) => {
    const [page, setPage] = useState<number>(1)
    const [search, setSearch] = useState<string>("")

    const query = useQuery({
        queryKey: ['playlists', {page, search, userId}],
        queryFn: async ({signal}) => {
            const response = await client.GET('/playlists', {
                params: {
                    query: {
                        pageNumber: page,
                        search,
                        userId
                    }
                },
                signal
            })
            if (response.error) {
                throw (response as unknown as { error: Error }).error;
            }
            return response.data;
        },
        placeholderData: keepPreviousData
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

    const handleSelectPlaylistClick = (playlistId: string) => {
        onPlaylistSelected?.(playlistId)
    }

    if (playlists.length === 0) {
        return <div className={styles.stateCard}>No playlists yet.</div>
    }

    return (
        <section className={styles.section}>
            <input type="text"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   placeholder="Search..."
            />
            <Pagination pagesCount={query.data.meta.pagesCount}
                        currentPage={page}
                        onPageNumberChange={setPage}
                        isFetching={query.isFetching}
            />
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
                        <span className={styles.statusDot} aria-hidden="true"/>
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
                            <div className={styles.actions}>
                                <button
                                    type="button"
                                    className={styles.editButton}
                                    onClick={() => handleSelectPlaylistClick(playlist.id)}
                                    aria-label="Edit playlist"
                                    title="Edit playlist"
                                >
                                    ✏️
                                </button>
                                <DeletePlaylist playlistId={playlist.id}/>
                            </div>
                            <span className={styles.badge}>#{playlist.attributes.order}</span>
                        </li>
                    )
                })}
            </ol>
        </section>
    )
}
