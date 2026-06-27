import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {authKeys} from "../../../shared/api/keys-factories/auth-keys-factory.ts";
import {localStorageKeys} from "../../../shared/config/localStorage-keys.ts";

export const getCallbackUrl = () => `${window.location.origin}/oauth/callback`

export const useLoginMutation = () => {

    const  queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ({code}: { code: string }) => {
            const response = await client.POST("/auth/login", {
                body: {
                    code: code,
                    rememberMe: true,
                    accessTokenTTL: "15m",
                    redirectUri: getCallbackUrl()
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
            localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)
            localStorage.setItem(localStorageKeys.accessToken, data.accessToken)

            queryClient.invalidateQueries({
                queryKey: authKeys.me()
            })
        }
    })

    return mutation

}
