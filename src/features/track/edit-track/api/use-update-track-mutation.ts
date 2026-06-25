import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {SchemaUpdateTrackRequestPayload} from "../../../../shared/api/schema.ts";
import {tracksKeys} from "../../../../shared/api/keys-factories/tracks-keys-factory.ts";

type MutationVariables = SchemaUpdateTrackRequestPayload & {trackId: string}

export const useUpdateTrackMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: MutationVariables) => {
            const {trackId, ...rest} = data

            const response = await client.PUT('/playlists/tracks/{trackId}', {
                params: {path: {trackId}},
                body: rest,
            })

            if (response.error) {
                throw response.error
            }

            return response.data
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({queryKey: tracksKeys.detail(variables.trackId)})
            queryClient.invalidateQueries({queryKey: tracksKeys.lists()})
        },
    })
}
