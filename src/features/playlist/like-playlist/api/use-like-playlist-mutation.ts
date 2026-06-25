import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";
import type {SchemaReactionOutput} from "../../../../shared/api/schema.ts";

export const useLikePlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (playlistId: string) => {
            const response = await client.POST('/playlists/{playlistId}/likes', {
                params: {path: {playlistId}},
            })

            if (response.error) throw response.error
            return response.data as SchemaReactionOutput
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: playlistsKeys.lists()})
        },
    })
}
