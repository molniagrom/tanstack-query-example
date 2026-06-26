import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useMeQuery } from '../features/auth/api/use-me-query.ts'
import { useUserProfilePlaylistsQuery } from '../widgets/user-profile/api/use-user-profile-playlists-query.ts'
import { useUserProfileTracksQuery } from '../widgets/user-profile/api/use-user-profile-tracks-query.ts'
import { useUserProfileLikedPlaylistsQuery } from '../widgets/user-profile/api/use-user-profile-liked-playlists-query.ts'
import { useUserProfileLikedTracksQuery } from '../widgets/user-profile/api/use-user-profile-liked-tracks-query.ts'
import styles from './user-profile-page.module.css'

type Tab = 'playlists' | 'tracks' | 'liked-playlists' | 'liked-tracks'

const TABS: { key: Tab; label: string }[] = [
  { key: 'playlists', label: 'My playlists' },
  { key: 'tracks', label: 'My Tracks' },
  { key: 'liked-playlists', label: 'My Liked Playlists' },
  { key: 'liked-tracks', label: 'My Liked Tracks' },
]

const SHOW_CREATE_BUTTON: Tab[] = ['playlists', 'liked-playlists']

function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('playlists')

  const meQuery = useMeQuery()
  const userId = meQuery.data?.userId

  const playlistsQuery = useUserProfilePlaylistsQuery(userId)
  const tracksQuery = useUserProfileTracksQuery(userId)
  const likedPlaylistsQuery = useUserProfileLikedPlaylistsQuery(userId)
  const likedTracksQuery = useUserProfileLikedTracksQuery(userId)

  const isLoading = meQuery.isPending || playlistsQuery.isPending || tracksQuery.isPending
  const playlists = playlistsQuery.data?.data ?? []
  const tracks = tracksQuery.data?.data ?? []
  const likedPlaylists = likedPlaylistsQuery.data?.data ?? []
  const likedTracks = likedTracksQuery.data?.data ?? []

  const handleEditProfile = () => {
    // TODO: open edit profile modal or navigate
  }

  const handleCreatePlaylist = () => {
    // TODO: open create playlist modal or navigate
  }

  const handleCardMenu = (_cardId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: open context menu
  }

  if (isLoading) {
    return (
      <section className={styles.profilePage}>
        <div className={styles.header}>
          <div className={`${styles.avatar} ${styles.skeleton}`} />
          <div className={styles.headerInfo}>
            <div className={`${styles.headerName} ${styles.skeleton}`} />
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={`${styles.statValue} ${styles.skeleton}`} />
                <span className={styles.statLabel}>PLAYLISTS</span>
              </div>
              <div className={styles.stat}>
                <span className={`${styles.statValue} ${styles.skeleton}`} />
                <span className={styles.statLabel}>TRACKS</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!meQuery.data) {
    return (
      <section className={styles.profilePage}>
        <div className={styles.header}>
          <p>Please log in to view your profile.</p>
        </div>
      </section>
    )
  }

  const getPlaylistCoverUrl = (images?: { main?: Array<{ url: string }> }) => {
    return images?.main?.[0]?.url || ''
  }

  const getTrackCoverUrl = (images?: { main?: Array<{ url: string }> }) => {
    return images?.main?.[0]?.url || ''
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  const renderPlaylistCards = (items: typeof playlists) => (
    <ul className={styles.grid}>
      {items.map((item) => (
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
                <button
                  type="button"
                  className={styles.cardMenuButton}
                  onClick={(e) => handleCardMenu(item.id, e)}
                  aria-label="More options"
                >
                  ⋯
                </button>
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

  const renderTrackCards = (items: typeof tracks) => (
    <ul className={styles.grid}>
      {items.map((item) => (
        <li key={item.id}>
          <article className={styles.card}>
            <img
              className={styles.cardImage}
              src={getTrackCoverUrl(item.attributes.images) || undefined}
              alt={item.attributes.title}
            />
            <div className={styles.cardInfo}>
              <h3 className={styles.cardTitle}>{item.attributes.title}</h3>
              <button
                type="button"
                className={styles.cardMenuButton}
                onClick={(e) => handleCardMenu(item.id, e)}
                aria-label="More options"
              >
                ⋯
              </button>
            </div>
            <p className={styles.cardSubtitle}>
              {formatDuration(item.attributes.duration)} · {item.attributes.likesCount} Likes
            </p>
          </article>
        </li>
      ))}
    </ul>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'playlists':
        return renderPlaylistCards(playlists)
      case 'tracks':
        return renderTrackCards(tracks)
      case 'liked-playlists':
        return renderPlaylistCards(likedPlaylists)
      case 'liked-tracks':
        return renderTrackCards(likedTracks)
    }
  }

  return (
    <section className={styles.profilePage}>
      <div className={styles.header}>
        <div className={styles.avatarPlaceholder}>
          {meQuery.data.login.charAt(0).toUpperCase()}
        </div>

        <div className={styles.headerInfo}>
          <h1 className={styles.headerName}>{meQuery.data.login}</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{playlists.length}</span>
              <span className={styles.statLabel}>PLAYLISTS</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{tracks.length}</span>
              <span className={styles.statLabel}>TRACKS</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.editButton}
          onClick={handleEditProfile}
        >
          Edit profile
        </button>
      </div>

      <ul className={styles.tabs}>
        {TABS.map((tab) => (
          <li key={tab.key}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.content}>
        {SHOW_CREATE_BUTTON.includes(activeTab) && (
          <button
            type="button"
            className={styles.createButton}
            onClick={handleCreatePlaylist}
          >
            Create a playlist
          </button>
        )}

        {renderContent()}
      </div>
    </section>
  )
}

export default UserProfilePage
