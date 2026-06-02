import styles from './playlists.module.css'
import { Pagination } from "../../../shared/ui/pagination"
import { usePlaylistsList } from "../model/use-playlists-list"
import { PlaylistsSearch } from './playlists-search'
import { PlaylistsStatusRow } from './playlists-status-row'
import { PlaylistsList } from './playlists-list'
import { PlaylistsLoadingState } from './playlists-loading-state'
import { PlaylistsErrorState } from './playlists-error-state'
import { PlaylistsEmptyState } from './playlists-empty-state'

type Props = {
    userId?: string
    onPlaylistSelected?: (playlistId: string) => void
    onPlaylistDeleted?: (playlistId: string) => void
    isSearchActive?: boolean
}

export const Playlists = ({ userId, onPlaylistSelected, onPlaylistDeleted, isSearchActive }: Props) => {
    const {
        search,
        setSearch,
        pageNumber,
        setPageNumber,
        playlists,
        isPending,
        isError,
        isFetching,
        error,
        pagesCount,
        refetch,
    } = usePlaylistsList({ userId })

    if (isPending) {
        return <PlaylistsLoadingState />
    }

    if (isError) {
        return <PlaylistsErrorState message={error?.message ?? 'Unknown error'} />
    }

    if (playlists.length === 0) {
        return <PlaylistsEmptyState />
    }

    return (
        <section className={styles.section}>
            {isSearchActive && (
                <PlaylistsSearch value={search} onChange={setSearch} />
            )}

            <Pagination
                pagesCount={pagesCount}
                currentPage={pageNumber}
                onPageNumberChange={setPageNumber}
                isFetching={isFetching}
            />

            <PlaylistsStatusRow isFetching={isFetching} onRefresh={refetch} />

            <PlaylistsList
                playlists={playlists}
                onEdit={onPlaylistSelected ?? (() => {})}
                onDelete={onPlaylistDeleted ?? (() => {})}
                isLoading={isFetching && !isPending}
            />
        </section>
    )
}
