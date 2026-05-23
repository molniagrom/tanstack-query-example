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
    const key = playlistsKeys.myList()

    return useMutation({
        mutationFn: async (payload: SchemaUpdatePlaylistRequestPayload) => {
            if (!playlistId) {
                throw new Error("playlistId is required");
            }

            const response = await client.PUT("/playlists/{playlistId}", {
                params: {
                    path: {playlistId}
                },
                body: payload
            })

            return response.data
        },

        onSuccess: (_data, payload) => {
            queryClient.setQueryData<SchemaGetPlaylistOutput>(key, prevData => {
                if (!prevData) {
                    return prevData
                }

                return {
                    ...prevData,
                    data: {
                        ...prevData.data,
                        attributes: {
                            ...prevData.data.attributes,
                            description: payload.data.attributes.description,
                            title: payload.data.attributes.title,
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
                                    description: payload.data.attributes.description,
                                    title: payload.data.attributes.title,
                                }
                            }
                        })
                    }
                }
            )

            onClose()
            void queryClient.invalidateQueries({
                queryKey: ['playlists'],
                refetchType: "all"
            })
        },
    })
}