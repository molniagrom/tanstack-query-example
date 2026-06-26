import { createFileRoute } from '@tanstack/react-router'
import { useMeQuery } from '../../../features/auth/api/use-me-query.ts'
import { useUserProfileLikedTracksQuery } from '../../../widgets/user-profile/api/use-user-profile-liked-tracks-query.ts'
import styles from '../../../pages/user-profile-page.module.css'

function LikedTracksTab() {
  const meQuery = useMeQuery()
  const userId = meQuery.data?.userId

  const likedTracksQuery = useUserProfileLikedTracksQuery(userId)
  const likedTracks = likedTracksQuery.data?.data ?? []

  const getTrackCoverUrl = (images?: { main?: Array<{ url: string }> }) => {
    return images?.main?.[0]?.url || ''
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  if (likedTracksQuery.isPending) {
    return <div>Loading liked tracks...</div>
  }

  if (likedTracks.length === 0) {
    return <p>No liked tracks yet.</p>
  }

  return (
    <ul className={styles.grid}>
      {likedTracks.map((item) => (
        <li key={item.id}>
          <article className={styles.card}>
            <img
              className={styles.cardImage}
              src={getTrackCoverUrl(item.attributes.images) || undefined}
              alt={item.attributes.title}
            />
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>{item.attributes.title}</h3>
            </div>
            <p className={styles.cardSubtitle}>
              {formatDuration(item.attributes.duration)} · {item.attributes.likesCount} Likes
            </p>
          </article>
        </li>
      ))}
    </ul>
  )
}

export const Route = createFileRoute('/user-profile/liked-tracks')({
  component: LikedTracksTab,
})
