import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SchemaCreatePlaylistRequestPayload } from "../../../../shared/api/schema.ts";
import { client } from "../../../../shared/api/client.ts";
import { playlistsKeys } from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";

export const useAddPlaylistMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SchemaCreatePlaylistRequestPayload) => {
            const response = await client.POST('/playlists', {
                body: data
            })

            if (response.error) {
                throw response.error
            }

            return response.data;
        },
        meta: {
            globalErrorHandler: "off",
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: playlistsKeys.lists(),
                refetchType: 'all'
            })
        }
    })
}
