import {useQuery} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {tagsKeys} from "../../../shared/api/keys-factories/tags-keys-factory.ts";

export const useSearchTagsQuery = (search: string) => {
    return useQuery({
        queryKey: tagsKeys.search(search),
        queryFn: async () => {
            const response = await client.GET('/tags/search', {
                params: {query: {search}}
            })

            if (response.error) {
                throw response.error
            }

            return response.data!.data
        },
        enabled: search.length >= 2,
        staleTime: 30_000,
    })
}
