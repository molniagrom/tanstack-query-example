import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";

type MutationVariables = {playlistId: string; putAfterItemId: string | null}

export const useReorderPlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({playlistId, putAfterItemId}: MutationVariables) => {
            const response = await client.PUT('/playlists/{playlistId}/reorder', {
                params: {path: {playlistId}},
                body: {putAfterItemId},
            })

            if (response.error) throw response.error
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: playlistsKeys.lists()})
        },
    })
}
