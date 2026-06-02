import styles from './playlists.module.css'
import { DeletePlaylist } from "../../../features/playlist/delete-playlist/ui/delete-playlist.tsx"

type PlaylistAttributes = {
    title: string
    tags?: Array<unknown>
    user?: { name?: string }
    order: number
}

type Props = {
    playlist: {
        id: string
        attributes: PlaylistAttributes
    }
    index: number
    onEdit: (playlistId: string) => void
    onDelete: (playlistId: string) => void
}

export const PlaylistItem = ({ playlist, index, onEdit, onDelete }: Props) => {
    const tagsCount = playlist.attributes.tags?.length ?? 0
    const authorName = playlist.attributes.user?.name ?? 'Unknown author'

    return (
        <li className={styles.item}>
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
                    onClick={() => onEdit(playlist.id)}
                    aria-label="Edit playlist"
                    title="Edit playlist"
                >
                    ✏️
                </button>
                <DeletePlaylist playlistId={playlist.id} onDelete={onDelete} />
            </div>

            <span className={styles.badge}>#{playlist.attributes.order}</span>
        </li>
    )
}
