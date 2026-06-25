import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import {playlistsKeys} from "../../../../shared/api/keys-factories/playlists-keys-factory.ts";
import type {SchemaReactionOutput, SchemaGetPlaylistOutput} from "../../../../shared/api/schema.ts";
import type {SchemaGetPlaylistsOutput} from "../../../../shared/api/schema.ts";

export const useDislikePlaylistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (playlistId: string) => {
            const response = await client.POST('/playlists/{playlistId}/dislikes', {
                params: {path: {playlistId}},
            })

            if (response.error) throw response.error
            return response.data as SchemaReactionOutput
        },
        meta: {globalErrorHandler: "off"},
        onMutate: async (playlistId) => {
            await queryClient.cancelQueries({queryKey: playlistsKeys.detail(playlistId)})
            await queryClient.cancelQueries({queryKey: playlistsKeys.lists()})

            const previousDetail = queryClient.getQueryData<SchemaGetPlaylistOutput>(
                playlistsKeys.detail(playlistId)
            )
            const previousLists = queryClient.getQueriesData<SchemaGetPlaylistsOutput>({
                queryKey: playlistsKeys.lists(),
            })

            const reaction = previousDetail?.data.attributes.currentUserReaction ?? 0
            let likesDelta = 0
            let dislikesDelta = 0
            let newReaction: 0 | 1 | -1

            if (reaction === -1) {
                newReaction = 0
                dislikesDelta = -1
            } else if (reaction === 1) {
                newReaction = -1
                dislikesDelta = 1
                likesDelta = -1
            } else {
                newReaction = -1
                dislikesDelta = 1
            }

            queryClient.setQueryData<SchemaGetPlaylistOutput>(
                playlistsKeys.detail(playlistId),
                (old) => old ? {
                    ...old,
                    data: {
                        ...old.data,
                        attributes: {
                            ...old.data.attributes,
                            currentUserReaction: newReaction,
                            likesCount: old.data.attributes.likesCount + likesDelta,
                            dislikesCount: old.data.attributes.dislikesCount + dislikesDelta,
                        },
                    },
                } : old
            )

            for (const [key, data] of previousLists) {
                if (!data?.data) continue
                queryClient.setQueryData<SchemaGetPlaylistsOutput>(key, {
                    ...data,
                    data: data.data.map((item) =>
                        item.id === playlistId
                            ? {
                                ...item,
                                attributes: {
                                    ...item.attributes,
                                    currentUserReaction: newReaction,
                                    likesCount: item.attributes.likesCount + likesDelta,
                                    dislikesCount: item.attributes.dislikesCount + dislikesDelta,
                                },
                            }
                            : item
                    ),
                })
            }

            return {previousDetail, previousLists}
        },
        onError: (_err, playlistId, context) => {
            if (context?.previousDetail) {
                queryClient.setQueryData(playlistsKeys.detail(playlistId), context.previousDetail)
            }
            if (context?.previousLists) {
                for (const [key, data] of context.previousLists) {
                    queryClient.setQueryData(key, data)
                }
            }
        },
        onSuccess: (_data, playlistId) => {
            queryClient.invalidateQueries({queryKey: playlistsKeys.lists()})
            queryClient.invalidateQueries({queryKey: playlistsKeys.detail(playlistId)})
        },
    })
}
