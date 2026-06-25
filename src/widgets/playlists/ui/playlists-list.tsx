import styles from './playlists.module.css'
import { PlaylistItem } from './playlist-item'
import { PlaylistItemSkeleton } from './playlist-item-skeleton'

type ImageVariant = {
    type: string
    width: number
    height: number
    fileSize: number
    url: string
}

type PlaylistAttributes = {
    title: string
    tags?: Array<unknown>
    user?: { name?: string }
    order: number
    images?: {
        main?: ImageVariant[]
    }
    likesCount?: number
    dislikesCount?: number
    currentUserReaction?: 0 | 1 | -1
}

type Props = {
    playlists: Array<{
        id: string
        attributes: PlaylistAttributes
    }>
    onEdit: (playlistId: string) => void
    onDelete: (playlistId: string) => void
    isLoading?: boolean
    isOwner?: boolean
}

export const PlaylistsList = ({ playlists, onEdit, onDelete, isLoading, isOwner }: Props) => {
    if (isLoading) {
        return (
            <ol className={styles.skeletonList}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <PlaylistItemSkeleton key={index} />
                ))}
            </ol>
        )
    }

    return (
        <ol className={styles.list}>
            {playlists.map((playlist, index) => (
                <PlaylistItem
                    key={playlist.id}
                    playlist={playlist}
                    index={index}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isOwner={isOwner}
                />
            ))}
        </ol>
    )
}
