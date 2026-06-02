import styles from './playlists.module.css'
import { DeletePlaylist } from "../../../features/playlist/delete-playlist/ui/delete-playlist.tsx"
import { UploadPlaylistImage } from "../../../features/playlist/upload-playlist-image/ui/upload-playlist-image"
import { PlaylistAvatar } from './playlist-avatar'

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
}

type Props = {
    playlist: {
        id: string
        attributes: PlaylistAttributes
    }
    index: number
    onEdit: (playlistId: string) => void
    onDelete: (playlistId: string) => void
    isOwner?: boolean
}

export const PlaylistItem = ({ playlist, index, onEdit, onDelete, isOwner }: Props) => {
    const tagsCount = playlist.attributes.tags?.length ?? 0
    const authorName = playlist.attributes.user?.name ?? 'Unknown author'

    return (
        <li className={styles.item}>
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>

            <PlaylistAvatar 
                images={playlist.attributes.images} 
                title={playlist.attributes.title} 
            />

            <div className={styles.meta}>
                <span className={styles.title}>{playlist.attributes.title}</span>
                <span className={styles.subtitle}>
                    {authorName} • {tagsCount} {tagsCount === 1 ? 'tag' : 'tags'}
                </span>
            </div>

            {isOwner && (
                <div className={styles.actions}>
                    <UploadPlaylistImage playlistId={playlist.id} />
                    <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => onEdit(playlist.id)}
                        aria-label="Edit playlist"
                        title="Edit playlist"
                    >
                        ✏️
                    </button>
                    <DeletePlaylist playlistId={playlist.id} onDelete={onDelete} />
                </div>
            )}

            <span className={styles.badge}>#{playlist.attributes.order}</span>
        </li>
    )
}
