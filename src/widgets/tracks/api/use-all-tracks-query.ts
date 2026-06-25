import {useQuery} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {tracksKeys} from "../../../shared/api/keys-factories/tracks-keys-factory.ts";
import type {SchemaGetTracksRequestPayload} from "../../../shared/api/schema.ts";

type UseAllTracksQueryArgs = {
    pageNumber?: number
    pageSize?: number
    search?: string
    sortBy?: SchemaGetTracksRequestPayload['sortBy']
    sortDirection?: SchemaGetTracksRequestPayload['sortDirection']
    tagsIds?: string[]
    artistsIds?: string[]
    userId?: string
    includeDrafts?: boolean
    onlyLikedByMe?: boolean
}

export const useAllTracksQuery = (args: UseAllTracksQueryArgs = {}) => {
    const {
        pageNumber = 1,
        pageSize = 20,
        search,
        sortBy = "publishedAt",
        sortDirection = "desc",
        tagsIds,
        artistsIds,
        userId,
        includeDrafts,
        onlyLikedByMe,
    } = args

    return useQuery({
        queryKey: tracksKeys.list(args),
        queryFn: async ({signal}) => {
            const response = await client.GET('/playlists/tracks', {
                params: {
                    query: {
                        pageNumber,
                        pageSize,
                        search: search || undefined,
                        sortBy,
                        sortDirection,
                        tagsIds: tagsIds?.length ? tagsIds : undefined,
                        artistsIds: artistsIds?.length ? artistsIds : undefined,
                        userId: userId || undefined,
                        includeDrafts: includeDrafts || undefined,
                        onlyLikedByMe: onlyLikedByMe || undefined,
                        paginationType: "offset",
                    }
                },
                signal,
            })

            if (response.error) {
                throw response.error
            }

            return response.data
        },
        placeholderData: (prev) => prev,
    })
}
