import { createFileRoute } from '@tanstack/react-router'
import UserProfilePage from '../../pages/user-profile-page'

export const Route = createFileRoute('/user-profile')({
  component: UserProfilePage,
})
