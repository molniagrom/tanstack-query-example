import {useQuery} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {artistsKeys} from "../../../shared/api/keys-factories/artists-keys-factory.ts";

type ArtistRef = { id: string; name: string }
type ArtistsSearchResponse = { data: ArtistRef[]; error: undefined } | { data: undefined; error: unknown }

export const useSearchArtistsQuery = (search: string) => {
    return useQuery({
        queryKey: artistsKeys.search(search),
        queryFn: async () => {
            const response = await client.GET('/artists/search', {
                params: {query: {search}}
            }) as ArtistsSearchResponse

            if (response.error) {
                throw response.error
            }

            return response.data
        },
        enabled: search.length >= 2,
        staleTime: 30_000,
    })
}
