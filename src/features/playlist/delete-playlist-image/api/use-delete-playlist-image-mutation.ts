import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";

export const useDeletePlaylistImageMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (playlistId: string) => {
            const response = await client.DELETE('/playlists/{playlistId}/images/main', {
                params: {path: {playlistId}}
            })

            if (response.error) {
                throw response.error
            }
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: (_, playlistId) => {
            queryClient.invalidateQueries({queryKey: playlistsKeys.lists()})
            queryClient.invalidateQueries({queryKey: playlistsKeys.detail(playlistId)})
        },
    })
}
