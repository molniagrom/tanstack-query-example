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

            if (response.error) {
                throw response.error
            }

            return response.data;
        },

        onMutate: async (playlistId) => {
            await queryClient.cancelQueries({queryKey: playlistsKeys.lists()})

            const previousLists = queryClient.getQueriesData<SchemaGetPlaylistsOutput | SchemaGetMyPlaylistsOutput>({
                queryKey: playlistsKeys.lists(),
            })

            queryClient.setQueriesData<SchemaGetPlaylistsOutput | SchemaGetMyPlaylistsOutput>(
                {queryKey: playlistsKeys.lists()},
                olddata => {
                    if (!olddata) return olddata
                    return {
                        ...olddata,
                        data: olddata.data.filter(p => p.id !== playlistId)
                    }
                })

            queryClient.removeQueries({queryKey: playlistsKeys.detail(playlistId)})

            return {previousLists}
        },

        onError: (_err, _playlistId, context) => {
            if (context?.previousLists) {
                for (const [key, data] of context.previousLists) {
                    queryClient.setQueryData(key, data)
                }
            }
        },
    })
}
