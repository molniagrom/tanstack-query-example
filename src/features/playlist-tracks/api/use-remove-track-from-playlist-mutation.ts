import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {tracksKeys} from "../../../shared/api/keys-factories/tracks-keys-factory.ts";

type MutationVariables = {playlistId: string; trackId: string}

export const useRemoveTrackFromPlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({playlistId, trackId}: MutationVariables) => {
            const response = await client.DELETE('/playlists/{playlistId}/relationships/tracks/{trackId}', {
                params: {path: {playlistId, trackId}},
            })

            if (response.error) {
                throw response.error
            }
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: tracksKeys.playlistTracks(variables.playlistId)})
        },
    })
}
