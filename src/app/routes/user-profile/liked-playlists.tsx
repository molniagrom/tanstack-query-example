import { createFileRoute, Link } from '@tanstack/react-router'
import { useMeQuery } from '../../../features/auth/api/use-me-query.ts'
import { useUserProfileLikedPlaylistsQuery } from '../../../widgets/user-profile/api/use-user-profile-liked-playlists-query.ts'
import styles from '../../../pages/user-profile-page.module.css'

function LikedPlaylistsTab() {
  const meQuery = useMeQuery()
  const userId = meQuery.data?.userId

  const likedPlaylistsQuery = useUserProfileLikedPlaylistsQuery(userId)
  const likedPlaylists = likedPlaylistsQuery.data?.data ?? []

  const getPlaylistCoverUrl = (images?: { main?: Array<{ url: string }> }) => {
    return images?.main?.[0]?.url || ''
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  if (likedPlaylistsQuery.isPending) {
    return <div>Loading liked playlists...</div>
  }

  if (likedPlaylists.length === 0) {
    return <p>No liked playlists yet.</p>
  }

  return (
    <ul className={styles.grid}>
      {likedPlaylists.map((item) => (
        <li key={item.id}>
          <Link
            to="/playlist-detail/$playlistId"
            params={{ playlistId: item.id }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <article className={styles.card}>
              <img
                className={styles.cardImage}
                src={getPlaylistCoverUrl(item.attributes.images) || undefined}
                alt={item.attributes.title}
              />
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{item.attributes.title}</h3>
              </div>
              <p className={styles.cardSubtitle}>
                {item.attributes.tracksCount} Tracks · {formatDuration(item.attributes.duration)}
              </p>
            </article>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const Route = createFileRoute('/user-profile/liked-playlists')({
  component: LikedPlaylistsTab,
})
