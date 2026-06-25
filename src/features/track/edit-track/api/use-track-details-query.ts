import {useQuery} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import {tracksKeys} from "../../../../shared/api/keys-factories/tracks-keys-factory.ts";

export const useTrackDetailsQuery = (trackId: string | null) => {
    return useQuery({
        queryKey: tracksKeys.detail(trackId ?? ''),
        queryFn: async () => {
            const response = await client.GET('/playlists/tracks/{trackId}', {
                params: {path: {trackId: trackId!}},
            })

            if (response.error) {
                throw response.error
            }

            return response.data
        },
        enabled: !!trackId,
    })
}
