import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {SchemaGetMyPlaylistsOutput, SchemaGetPlaylistsOutput} from "../../../../shared/api/schema.ts";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";

export const useDeleteMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (playlistId: string) => {
            const response = await client.DELETE('/playlists/{playlistId}', {
                params: {
                    path: {playlistId}
                }
            });

            return response.data;
        },

        onSuccess: (_, playlistId) => {
            queryClient.setQueriesData<SchemaGetPlaylistsOutput | SchemaGetMyPlaylistsOutput>(
                {queryKey: playlistsKeys.lists()},
                olddata => {
                    if (!olddata) {
                        return olddata
                    }

                    return {
                        ...olddata,
                        data: olddata.data.filter(p => p.id !== playlistId)
                    }
                }
            )
        }
    })
}
