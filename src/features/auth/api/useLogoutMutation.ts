import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {authKeys} from "../../../shared/api/keys-factories/auth-keys-factory.ts";
import {localStorageKeys} from "../../../shared/config/localStorage-keys.ts";

export const useLogoutMutation = () => {

    const  queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await client.POST("/auth/logout", {
                body: {
                    refreshToken: localStorage.getItem(localStorageKeys.refreshToken)!,
                }
            })

            return response.data
        },
        onSuccess: async () => {
            localStorage.removeItem(localStorageKeys.refreshToken)
            localStorage.removeItem(localStorageKeys.accessToken)

            queryClient.resetQueries({
                queryKey: authKeys.me()
            })

        }
    })

    return mutation

}
