import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {artistsKeys} from "../../../shared/api/keys-factories/artists-keys-factory.ts";

export const useDeleteArtistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (artistId: string) => {
            const response = await client.DELETE('/artists/{id}', {
                params: {path: {id: artistId}}
            })

            if (response.error) {
                throw response.error
            }
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: artistsKeys.all})
        },
    })
}
