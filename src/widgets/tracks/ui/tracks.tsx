import styles from './tracks.module.css'
import {Pagination} from "../../../shared/ui/pagination"
import {useTracksList} from "../model/use-tracks-list"
import {TrackItem} from "./track-item"
import {PlaylistItemSkeleton} from "../../playlists/ui/playlist-item-skeleton"

type TrackArtist = {
    id: string
    type: string
    attributes: { name: string }
}

type TrackItem = {
    id: string
    type: string
    attributes: {
        title: string
        addedAt: string
        likesCount: number
        attachments: Array<{ id: string; url: string; contentType: string }>
        images: { main?: Array<{ type: string; url: string }> }
        user: { id: string; name: string }
        currentUserReaction: 0 | 1 | -1
        isPublished: boolean
        publishedAt?: string | null
        duration: number
    }
    relationships?: {
        artists: { data: Array<{ id: string; type: string }> }
    }
}

type Props = {
    userId?: string
}

export const Tracks = ({userId}: Props) => {
    const {
        search,
        setSearch,
        pageNumber,
        setPageNumber,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        tracks,
        isPending,
        isError,
        isFetching,
        error,
        pagesCount,
    } = useTracksList({userId})

    const allTracks = tracks as TrackItem[]
    const allArtists: TrackArtist[] = []

    if (isPending) {
        return (
            <section className={styles.section}>
                <ol className={styles.skeletonList}>
                    {Array.from({length: 5}).map((_, i) => (
                        <PlaylistItemSkeleton key={i} />
                    ))}
                </ol>
            </section>
        )
    }

    if (isError) {
        return (
            <section className={styles.section}>
                <div className={styles.errorState}>
                    {error?.message ?? "Failed to load tracks"}
                </div>
            </section>
        )
    }

    if (allTracks.length === 0) {
        return (
            <section className={styles.section}>
                <div className={styles.emptyState}>No tracks yet</div>
            </section>
        )
    }

    return (
        <section className={styles.section}>
            <div className={styles.searchRow}>
                <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPageNumber(1) }}
                    placeholder="Search tracks..."
                    className={styles.searchInput}
                />
                <div className={styles.sortControls}>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as "publishedAt" | "likesCount")}
                        className={styles.sortSelect}
                    >
                        <option value="publishedAt">Date</option>
                        <option value="likesCount">Likes</option>
                    </select>
                    <button
                        type="button"
                        className={styles.sortButton}
                        onClick={() => setSortDirection(d => d === "asc" ? "desc" : "asc")}
                        title={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
                    >
                        {sortDirection === "asc" ? "↑" : "↓"}
                    </button>
                </div>
            </div>

            <Pagination
                pagesCount={pagesCount}
                currentPage={pageNumber}
                onPageNumberChange={setPageNumber}
                isFetching={isFetching}
            />

            <ol className={styles.list}>
                {allTracks.map((track, index) => (
                    <TrackItem
                        key={track.id}
                        track={track}
                        index={index}
                        artists={allArtists}
                        queue={allTracks}
                    />
                ))}
            </ol>
        </section>
    )
}
