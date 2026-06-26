import { useQuery } from '@tanstack/react-query'
import { client } from '../../../shared/api/client.ts'
import { playlistsKeys } from '../../../shared/api/keys-factories/playlists-keys-factory.ts'

export const useUserProfileLikedPlaylistsQuery = (userId: string | undefined) => {
    return useQuery({
        queryKey: [...playlistsKeys.lists(), 'profile', 'liked', userId],
        queryFn: async ({ signal }) => {
            const response = await client.GET('/playlists', {
                params: {
                    query: {
                        pageNumber: 1,
                        pageSize: 20,
                        sortBy: 'addedAt',
                        sortDirection: 'desc',
                        onlyLikedByMe: true,
                    },
                },
                signal,
            })
            if (response.error) {
                throw (response as unknown as { error: Error }).error
            }
            return response.data
        },
        enabled: !!userId,
        retry: false,
    })
}
