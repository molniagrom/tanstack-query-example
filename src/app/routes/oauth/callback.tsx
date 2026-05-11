import { createFileRoute } from '@tanstack/react-router'
import {OauthCallbackPage} from "../../../pages/auth/oauth-callback-page.tsx";

export const Route = createFileRoute('/oauth/callback')({
  component: OauthCallbackPage,
})

