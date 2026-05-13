import {useMutation} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";

export const LoginButton = () => {
    const mutation = useMutation({
        mutationFn: async ({code}: { code: string }) => {
            const response = await client.POST("/auth/login", {
                body: {
                    code: code,
                    rememberMe: true,
                    accessTokenTTL: "1d",
                    redirectUri: "???"
                }
            })
            if (response.error) {
                throw new Error(response.error.message)
            }

            return response.data
        }
    })
    const handleLoginClick = () => {
        window.addEventListener("message", handleOauthMessage)
        const callbackUrl = "http://localhost:5173/oauth/callback"
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

    return <button onClick={handleLoginClick}> Login with APIHUB</button>
}