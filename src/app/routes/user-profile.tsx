import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { useMeQuery } from '../../features/auth/api/use-me-query.ts'
import { UploadAvatar } from '../../features/profile/upload-avatar/ui/UploadAvatar.tsx'
import styles from '../../pages/user-profile-page.module.css'

const TABS = [
  { to: '/user-profile/my-playlists' as const, label: 'My playlists' },
  { to: '/user-profile/my-tracks' as const, label: 'My Tracks' },
  { to: '/user-profile/liked-playlists' as const, label: 'My Liked Playlists' },
  { to: '/user-profile/liked-tracks' as const, label: 'My Liked Tracks' },
]

function UserProfileLayout() {
  const meQuery = useMeQuery()

  if (meQuery.isPending) {
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

  return (
    <section className={styles.profilePage}>
      <div className={styles.header}>
        <UploadAvatar userId={meQuery.data.userId} login={meQuery.data.login} />

        <div className={styles.headerInfo}>
          <h1 className={styles.headerName}>{meQuery.data.login}</h1>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>—</span>
              <span className={styles.statLabel}>PLAYLISTS</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>—</span>
              <span className={styles.statLabel}>TRACKS</span>
            </div>
          </div>
        </div>
      </div>

      <ul className={styles.tabs}>
        {TABS.map((tab) => (
          <li key={tab.to}>
            <Link
              to={tab.to}
              className={styles.tab}
              activeOptions={{ exact: true }}
              activeProps={{ className: `${styles.tab} ${styles.tabActive}` }}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.content}>
        <Outlet />
      </div>
    </section>
  )
}

export const Route = createFileRoute('/user-profile')({
  beforeLoad: ({ location }) => {
    if (location.pathname === '/user-profile') {
      throw redirect({ to: '/user-profile/my-playlists' })
    }
  },
  component: UserProfileLayout,
})
