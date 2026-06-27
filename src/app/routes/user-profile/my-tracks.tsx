import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMeQuery } from '../../../features/auth/api/use-me-query.ts'
import { useUserProfileTracksQuery } from '../../../widgets/user-profile/api/use-user-profile-tracks-query.ts'
import { UploadTrackForm } from '../../../features/track/upload-track/ui/UploadTrackForm.tsx'
import styles from '../../../pages/user-profile-page.module.css'

function MyTracksTab() {
  const meQuery = useMeQuery()
  const userId = meQuery.data?.userId

  const tracksQuery = useUserProfileTracksQuery(userId)
  const tracks = tracksQuery.data?.data ?? []

  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const getTrackCoverUrl = (images?: { main?: Array<{ url: string }> }) => {
    return images?.main?.[0]?.url || ''
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  return (
    <>
      <button
        type="button"
        className={styles.createButton}
        onClick={() => setIsUploadOpen(true)}
      >
        Создать трек
      </button>

      <UploadTrackForm
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      {tracksQuery.isError && (
        <div>Ошибка загрузки треков</div>
      )}

      {tracksQuery.isPending ? (
        <div>Загрузка треков...</div>
      ) : tracks.length === 0 ? (
        <p>У вас пока нет треков</p>
      ) : (
        <ul className={styles.grid}>
          {tracks.map((item) => (
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
      )}
    </>
  )
}

export const Route = createFileRoute('/user-profile/my-tracks')({
  component: MyTracksTab,
})
