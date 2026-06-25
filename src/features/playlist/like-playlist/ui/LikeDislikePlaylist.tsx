import styles from './like-dislike-playlist.module.css'
import {useLikePlaylistMutation} from "../api/use-like-playlist-mutation.ts";
import {useDislikePlaylistMutation} from "../api/use-dislike-playlist-mutation.ts";
import {useRemovePlaylistReactionMutation} from "../api/use-remove-playlist-reaction-mutation.ts";

type Props = {
    playlistId: string
    currentUserReaction: 0 | 1 | -1
    likesCount: number
    dislikesCount: number
}

export const LikeDislikePlaylist = ({playlistId, currentUserReaction, likesCount, dislikesCount}: Props) => {
    const likeMutation = useLikePlaylistMutation()
    const dislikeMutation = useDislikePlaylistMutation()
    const removeReactionMutation = useRemovePlaylistReactionMutation()

    const handleLike = () => likeMutation.mutate(playlistId)
    const handleDislike = () => dislikeMutation.mutate(playlistId)
    const handleRemove = () => removeReactionMutation.mutate(playlistId)

    return (
        <div className={styles.reactions}>
            {currentUserReaction === 1 ? (
                <button
                    type="button"
                    className={`${styles.reactionButton} ${styles.reactionButtonActive}`}
                    onClick={handleRemove}
                    title="Remove like"
                >
                    👍 <span className={styles.count}>{likesCount}</span>
                </button>
            ) : (
                <button
                    type="button"
                    className={styles.reactionButton}
                    onClick={handleLike}
                    disabled={likeMutation.isPending}
                    title="Like"
                >
                    👍 <span className={styles.count}>{likesCount}</span>
                </button>
            )}
            {currentUserReaction === -1 ? (
                <button
                    type="button"
                    className={`${styles.reactionButton} ${styles.dislikeButton} ${styles.dislikeButtonActive}`}
                    onClick={handleRemove}
                    title="Remove dislike"
                >
                    👎 <span className={styles.count}>{dislikesCount}</span>
                </button>
            ) : (
                <button
                    type="button"
                    className={`${styles.reactionButton} ${styles.dislikeButton}`}
                    onClick={handleDislike}
                    disabled={dislikeMutation.isPending}
                    title="Dislike"
                >
                    👎 <span className={styles.count}>{dislikesCount}</span>
                </button>
            )}
        </div>
    )
}
