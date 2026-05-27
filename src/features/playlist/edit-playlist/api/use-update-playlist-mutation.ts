import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {
    SchemaGetPlaylistOutput,
    SchemaGetPlaylistsOutput,
    SchemaUpdatePlaylistRequestPayload
} from "../../../../shared/api/schema.ts";
import {client} from "../../../../shared/api/client.ts";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";

export const useUpdatePlaylistMutation = (playlistId: string | null) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
            if (!playlistId) {
                throw new Error("playlistId is required");
            }

            const response = await client.PUT("/playlists/{playlistId}", {
                params: {
                    path: {playlistId}
                },
                body: data
            })

            return response.data
        },

        onSuccess: (_response, variables) => {
            if (!playlistId) {
                return
            }

            queryClient.setQueryData<SchemaGetPlaylistOutput>(
                playlistsKeys.detail(playlistId),
                prevData => {
                    if (!prevData) {
                        return prevData
                    }

                    return {
                        ...prevData,
                        data: {
                            ...prevData.data,
                            attributes: {
                                ...prevData.data.attributes,
                                description: variables.data.attributes.description,
                                title: variables.data.attributes.title,
                            }
                        }
                    }
                })

            queryClient.setQueriesData<SchemaGetPlaylistsOutput>(
                {queryKey: ['playlists']},
                prevData => {
                    if (!prevData || !Array.isArray(prevData.data)) {
                        return prevData
                    }

                    return {
                        ...prevData,
                        data: prevData.data.map(playlist => {
                            if (playlist.id !== playlistId) {
                                return playlist
                            }

                            return {
                                ...playlist,
                                attributes: {
                                    ...playlist.attributes,
                                    description: variables.data.attributes.description,
                                    title: variables.data.attributes.title,
                                }
                            }
                        })
                    }
                }
            )
        },
        onSettled: () => {
            void queryClient.invalidateQueries({
                queryKey: playlistsKeys.lists(),
                refetchType: "all"
            })

            if (playlistId) {
                void queryClient.invalidateQueries({
                    queryKey: playlistsKeys.detail(playlistId),
                    refetchType: "all"
                })
            }
        }
    })
}
