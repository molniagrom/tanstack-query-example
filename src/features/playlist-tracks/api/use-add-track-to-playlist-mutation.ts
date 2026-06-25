import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import type {SchemaAddTrackToPlaylistRequestPayload} from "../../../shared/api/schema.ts";
import {tracksKeys} from "../../../shared/api/keys-factories/tracks-keys-factory.ts";

type MutationVariables = SchemaAddTrackToPlaylistRequestPayload & {playlistId: string}

export const useAddTrackToPlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: MutationVariables) => {
            const {playlistId, ...rest} = data

            const response = await client.POST('/playlists/{playlistId}/relationships/tracks', {
                params: {path: {playlistId}},
                body: rest,
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
