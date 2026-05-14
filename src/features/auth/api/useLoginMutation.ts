import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";

export const callbackUrl = "http://localhost:5173/oauth/callback"

export const useLoginMutation = () => {

    const  queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ({code}: { code: string }) => {
            const response = await client.POST("/auth/login", {
                body: {
                    code: code,
                    rememberMe: true,
                    accessTokenTTL: "10s",
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

            queryClient.invalidateQueries({
                queryKey: ['auth', 'me']
            })
        }
    })

    return mutation

}