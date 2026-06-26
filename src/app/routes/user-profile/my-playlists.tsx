import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMeQuery } from '../../../features/auth/api/use-me-query.ts'
import { useUserProfilePlaylistsQuery } from '../../../widgets/user-profile/api/use-user-profile-playlists-query.ts'
import { Playlists } from '../../../widgets/playlists/ui/playlists.tsx'
import { AddPlaylistForm } from '../../../features/playlist/add-playlist/ui/AddPlaylistForm.tsx'
import { EditPlaylistForm } from '../../../features/playlist/edit-playlist/ui/EditPlaylistForm.tsx'
import styles from '../../../pages/user-profile-page.module.css'

function MyPlaylistsTab() {
  const meQuery = useMeQuery()
  const userId = meQuery.data?.userId

  const playlistsQuery = useUserProfilePlaylistsQuery(userId)

  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false)
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null)

  const handlePlaylistDelete = (playlistId: string) => {
    if (playlistId === editingPlaylistId) {
      setEditingPlaylistId(null)
    }
  }

  if (playlistsQuery.isPending) {
    return <div>Loading playlists...</div>
  }

  return (
    <>
      <button
        type="button"
        className={styles.createButton}
        onClick={() => setIsAddPlaylistOpen(true)}
      >
        Create a playlist
      </button>

      <AddPlaylistForm
        isOpen={isAddPlaylistOpen}
        onClose={() => setIsAddPlaylistOpen(false)}
      />

      <EditPlaylistForm
        key={editingPlaylistId ?? 'closed'}
        playlistId={editingPlaylistId}
        onClose={() => setEditingPlaylistId(null)}
      />

      <Playlists
        userId={userId}
        onPlaylistSelected={(playlistId) => setEditingPlaylistId(playlistId)}
        onPlaylistDeleted={handlePlaylistDelete}
        isOwner={true}
      />
    </>
  )
}

export const Route = createFileRoute('/user-profile/my-playlists')({
  component: MyPlaylistsTab,
})
