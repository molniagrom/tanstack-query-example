import { useQuery } from '@tanstack/react-query'
import { client } from '../../../shared/api/client.ts'
import { tracksKeys } from '../../../shared/api/keys-factories/tracks-keys-factory.ts'

export const useUserProfileTracksQuery = (userId: string | undefined) => {
    return useQuery({
        queryKey: [...tracksKeys.lists(), 'profile', userId],
        queryFn: async ({ signal }) => {
            const response = await client.GET('/playlists/tracks', {
                params: {
                    query: {
                        userId: userId!,
                        pageNumber: 1,
                        pageSize: 20,
                        sortBy: 'publishedAt',
                        sortDirection: 'desc',
                        paginationType: 'offset',
                    },
                },
                signal,
            })
            if (response.error) throw response.error
            return response.data
        },
        enabled: !!userId,
        retry: false,
    })
}
