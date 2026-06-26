import styles from './like-dislike-playlist.module.css'
import {useLikePlaylistMutation} from "../api/use-like-playlist-mutation.ts";
import {useDislikePlaylistMutation} from "../api/use-dislike-playlist-mutation.ts";
import {useRemovePlaylistReactionMutation} from "../api/use-remove-playlist-reaction-mutation.ts";
import {useCallback, useRef, useState} from "react";

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

    const [optimisticReaction, setOptimisticReaction] = useState<0 | 1 | -1>(currentUserReaction)
    const [optimisticLikes, setOptimisticLikes] = useState(likesCount)
    const [optimisticDislikes, setOptimisticDislikes] = useState(dislikesCount)
    const prevPropsRef = useRef({currentUserReaction, likesCount, dislikesCount})

    if (prevPropsRef.current.currentUserReaction !== currentUserReaction ||
        prevPropsRef.current.likesCount !== likesCount ||
        prevPropsRef.current.dislikesCount !== dislikesCount) {
        prevPropsRef.current = {currentUserReaction, likesCount, dislikesCount}
        setOptimisticReaction(currentUserReaction)
        setOptimisticLikes(likesCount)
        setOptimisticDislikes(dislikesCount)
    }

    const handleLike = useCallback(() => {
        if (optimisticReaction === 1) {
            setOptimisticReaction(0)
            setOptimisticLikes(l => l - 1)
            removeReactionMutation.mutate(playlistId, {
                onError: () => {
                    setOptimisticReaction(currentUserReaction)
                    setOptimisticLikes(likesCount)
                    setOptimisticDislikes(dislikesCount)
                }
            })
        } else {
            const newReaction: 0 | 1 | -1 = optimisticReaction === -1 ? 1 : 1
            const likesDelta = optimisticReaction === -1 ? 1 : 1
            const dislikesDelta = optimisticReaction === -1 ? -1 : 0
            setOptimisticReaction(newReaction)
            setOptimisticLikes(l => l + likesDelta)
            setOptimisticDislikes(d => d + dislikesDelta)
            likeMutation.mutate(playlistId, {
                onError: () => {
                    setOptimisticReaction(currentUserReaction)
                    setOptimisticLikes(likesCount)
                    setOptimisticDislikes(dislikesCount)
                }
            })
        }
    }, [optimisticReaction, playlistId, currentUserReaction, likesCount, dislikesCount])

    const handleDislike = useCallback(() => {
        if (optimisticReaction === -1) {
            setOptimisticReaction(0)
            setOptimisticDislikes(d => d - 1)
            removeReactionMutation.mutate(playlistId, {
                onError: () => {
                    setOptimisticReaction(currentUserReaction)
                    setOptimisticLikes(likesCount)
                    setOptimisticDislikes(dislikesCount)
                }
            })
        } else {
            const likesDelta = optimisticReaction === 1 ? -1 : 0
            setOptimisticReaction(-1)
            setOptimisticLikes(l => l + likesDelta)
            setOptimisticDislikes(d => d + 1)
            dislikeMutation.mutate(playlistId, {
                onError: () => {
                    setOptimisticReaction(currentUserReaction)
                    setOptimisticLikes(likesCount)
                    setOptimisticDislikes(dislikesCount)
                }
            })
        }
    }, [optimisticReaction, playlistId, currentUserReaction, likesCount, dislikesCount])

    const handleRemove = useCallback(() => {
        const likesDelta = optimisticReaction === 1 ? -1 : 0
        const dislikesDelta = optimisticReaction === -1 ? -1 : 0
        setOptimisticReaction(0)
        setOptimisticLikes(l => l + likesDelta)
        setOptimisticDislikes(d => d + dislikesDelta)
        removeReactionMutation.mutate(playlistId, {
            onError: () => {
                setOptimisticReaction(currentUserReaction)
                setOptimisticLikes(likesCount)
                setOptimisticDislikes(dislikesCount)
            }
        })
    }, [optimisticReaction, playlistId, currentUserReaction, likesCount, dislikesCount])

    return (
        <div className={styles.reactions}>
            {optimisticReaction === 1 ? (
                <button
                    type="button"
                    className={`${styles.reactionButton} ${styles.reactionButtonActive}`}
                    onClick={handleRemove}
                    title="Remove like"
                >
                    👍 <span className={styles.count}>{optimisticLikes}</span>
                </button>
            ) : (
                <button
                    type="button"
                    className={styles.reactionButton}
                    onClick={handleLike}
                    disabled={likeMutation.isPending}
                    title="Like"
                >
                    👍 <span className={styles.count}>{optimisticLikes}</span>
                </button>
            )}
            {optimisticReaction === -1 ? (
                <button
                    type="button"
                    className={`${styles.reactionButton} ${styles.dislikeButton} ${styles.dislikeButtonActive}`}
                    onClick={handleRemove}
                    title="Remove dislike"
                >
                    👎 <span className={styles.count}>{optimisticDislikes}</span>
                </button>
            ) : (
                <button
                    type="button"
                    className={`${styles.reactionButton} ${styles.dislikeButton}`}
                    onClick={handleDislike}
                    disabled={dislikeMutation.isPending}
                    title="Dislike"
                >
                    👎 <span className={styles.count}>{optimisticDislikes}</span>
                </button>
            )}
        </div>
    )
}
