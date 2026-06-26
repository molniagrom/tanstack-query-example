import { useQuery } from '@tanstack/react-query'
import { client } from '../../../shared/api/client.ts'
import { playlistsKeys } from '../../../shared/api/keys-factories/playlists-keys-factory.ts'

export const useUserProfilePlaylistsQuery = (userId: string | undefined) => {
    return useQuery({
        queryKey: playlistsKeys.myList(),
        queryFn: async ({ signal }) => {
            const response = await client.GET('/playlists', {
                params: { query: { userId: userId!, pageNumber: 1, pageSize: 20 } },
                signal,
            })
            if (response.error) throw response.error
            return response.data
        },
        enabled: !!userId,
        retry: false,
    })
}
