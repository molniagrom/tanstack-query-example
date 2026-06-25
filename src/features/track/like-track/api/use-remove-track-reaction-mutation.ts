import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import {tracksKeys} from "../../../../shared/api/keys-factories/tracks-keys-factory.ts";
import type {SchemaReactionOutput} from "../../../../shared/api/schema.ts";

export const useRemoveTrackReactionMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (trackId: string) => {
            const response = await client.DELETE('/playlists/tracks/{trackId}/reactions', {
                params: {path: {trackId}},
            })

            if (response.error) throw response.error
            return response.data as SchemaReactionOutput
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: tracksKeys.lists()})
        },
    })
}
