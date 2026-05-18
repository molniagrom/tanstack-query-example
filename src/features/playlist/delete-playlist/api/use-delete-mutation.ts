import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {SchemaGetMyPlaylistsOutput, SchemaGetPlaylistsOutput} from "../../../../shared/api/schema.ts";

export const useDeleteMutation = (playlistId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            const response = await client.DELETE('/playlists/{playlistId}', {
                params: {
                    path: {playlistId}
                }
            });

            return response.data;
        },

        onSuccess: () => {
            queryClient.setQueriesData<SchemaGetPlaylistsOutput | SchemaGetMyPlaylistsOutput>(
                {queryKey: ['playlists']},
                (olddata) => {
                    if (!olddata) {
                        return olddata
                    }

                    return {
                        ...olddata,
                        data: olddata.data.filter(p => p.id !== playlistId)
                    }
                }
            )

            // queryClient.invalidateQueries({
            //     queryKey: ['playlists'],
            //     refetchType: 'all'
            // })
        }
    })
}
