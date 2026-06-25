import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {tracksKeys} from "../../../shared/api/keys-factories/tracks-keys-factory.ts";

type MutationVariables = {playlistId: string; trackId: string; putAfterItemId: string | null}

export const useReorderTrackMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({playlistId, trackId, putAfterItemId}: MutationVariables) => {
            const response = await client.PUT('/playlists/{playlistId}/tracks/{trackId}/reorder', {
                params: {path: {playlistId, trackId}},
                body: {putAfterItemId},
            })

            if (response.error) throw response.error
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: tracksKeys.playlistTracks(variables.playlistId)})
        },
    })
}
