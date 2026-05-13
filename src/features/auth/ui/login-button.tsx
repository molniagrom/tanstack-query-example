import {useMutation} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import styles from './account-bar.module.css'

export const LoginButton = () => {
    const callbackUrl = "http://localhost:5173/oauth/callback"

    const mutation = useMutation({
        mutationFn: async ({code}: { code: string }) => {
            const response = await client.POST("/auth/login", {
                body: {
                    code: code,
                    rememberMe: true,
                    accessTokenTTL: "1d",
                    redirectUri: callbackUrl
                }
            })
            if (response.error) {
                const message =
                    typeof response.error === 'object' &&
                    response.error &&
                    'message' in response.error &&
                    typeof response.error.message === 'string'
                        ? response.error.message
                        : 'Login request failed'

                throw new Error(message)
            }

            return response.data
        },
        onSuccess: async (data) => {
            localStorage.setItem('musicfun-refresh-token', data.refreshToken)
            localStorage.setItem('musicfun-access-token', data.accessToken)
        }
    })
    const handleLoginClick = () => {
        window.addEventListener("message", handleOauthMessage)
        window.open(`https://musicfun.it-incubator.app/api/1.0/auth/oauth-redirect?callbackUrl=${callbackUrl}`, "apihub-oauth2", "width=500,height=600")
    }

    const handleOauthMessage = (event: MessageEvent) => {
        window.removeEventListener("message", handleOauthMessage)

        if (event.origin !== document.location.origin) {
            console.warn("Origin, not match.")
            return;
        }
        const code = event.data.code
        if (!code) {
            console.warn("no code in message")
            return;
        }

        mutation.mutate({code})

    }

    return (
        <button className={styles.loginButton} onClick={handleLoginClick} disabled={mutation.isPending}>
            Login with APIHUB
        </button>
    )
}
