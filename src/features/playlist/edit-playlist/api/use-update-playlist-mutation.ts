import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {
    SchemaGetPlaylistOutput,
    SchemaGetPlaylistsOutput,
    SchemaUpdatePlaylistRequestPayload
} from "../../../../shared/api/schema.ts";
import {client} from "../../../../shared/api/client.ts";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";

type MutationVariables = SchemaUpdatePlaylistRequestPayload & {playlistId: string}

export const useUpdatePlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: MutationVariables) => {

            const {playlistId, ...rest} = data
            if (!playlistId) {
                throw new Error("playlistId is required");
            }

            const response = await client.PUT("/playlists/{playlistId}", {
                params: {
                    path: {playlistId}
                },
                body: {...rest, tegIds: []}
            })

            if (response.error) {
                throw response.error
            }

            return response.data
        },

        meta: {
            globalErrorHandler: "off",
        },
        onSuccess: (_response, variables: MutationVariables) => {
            if (!variables.playlistId) {
                return
            }

            queryClient.setQueryData<SchemaGetPlaylistOutput>(
                playlistsKeys.detail(variables.playlistId),
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
                            if (playlist.id !== variables.playlistId) {
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
        onSettled: (_data, _error, variables: MutationVariables) => {
            void queryClient.invalidateQueries({
                queryKey: playlistsKeys.lists(),
                refetchType: "all"
            })

            if (variables.playlistId) {
                void queryClient.invalidateQueries({
                    queryKey: playlistsKeys.detail(variables.playlistId),
                    refetchType: "all"
                })
            }
        }
    })
}
