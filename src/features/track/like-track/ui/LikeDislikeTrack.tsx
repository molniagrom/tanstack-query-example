import styles from './like-dislike-track.module.css'
import {useLikeTrackMutation} from "../api/use-like-track-mutation.ts";
import {useDislikeTrackMutation} from "../api/use-dislike-track-mutation.ts";
import {useRemoveTrackReactionMutation} from "../api/use-remove-track-reaction-mutation.ts";

type Props = {
    trackId: string
    currentUserReaction: 0 | 1 | -1
    likesCount: number
}

export const LikeDislikeTrack = ({trackId, currentUserReaction, likesCount}: Props) => {
    const likeMutation = useLikeTrackMutation()
    const dislikeMutation = useDislikeTrackMutation()
    const removeReactionMutation = useRemoveTrackReactionMutation()

    const handleLike = () => {
        likeMutation.mutate(trackId)
    }

    const handleDislike = () => {
        dislikeMutation.mutate(trackId)
    }

    const handleRemove = () => {
        removeReactionMutation.mutate(trackId)
    }

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
                    👎
                </button>
            ) : (
                <button
                    type="button"
                    className={`${styles.reactionButton} ${styles.dislikeButton}`}
                    onClick={handleDislike}
                    disabled={dislikeMutation.isPending}
                    title="Dislike"
                >
                    👎
                </button>
            )}
        </div>
    )
}
