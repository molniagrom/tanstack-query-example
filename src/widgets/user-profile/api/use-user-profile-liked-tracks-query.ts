import { useQuery } from '@tanstack/react-query'
import { client } from '../../../shared/api/client.ts'
import { tracksKeys } from '../../../shared/api/keys-factories/tracks-keys-factory.ts'

export const useUserProfileLikedTracksQuery = (userId: string | undefined) => {
    return useQuery({
        queryKey: [...tracksKeys.lists(), 'profile', 'liked', userId],
        queryFn: async ({ signal }) => {
            const response = await client.GET('/playlists/tracks', {
                params: {
                    query: {
                        pageNumber: 1,
                        pageSize: 100,
                        sortBy: 'publishedAt',
                        sortDirection: 'desc',
                        paginationType: 'offset',
                        onlyLikedByMe: true,
                    },
                },
                signal,
            })
            if (response.error) throw response.error
            return response.data
        },
        enabled: !!userId,
    })
}
