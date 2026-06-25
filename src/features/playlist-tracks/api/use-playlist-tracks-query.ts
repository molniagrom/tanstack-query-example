import {useQuery} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {tracksKeys} from "../../../shared/api/keys-factories/tracks-keys-factory.ts";

export const usePlaylistTracksQuery = (playlistId: string | null) => {
    return useQuery({
        queryKey: tracksKeys.playlistTracks(playlistId ?? ''),
        queryFn: async ({signal}) => {
            const response = await client.GET('/playlists/{playlistId}/tracks', {
                params: {path: {playlistId: playlistId!}},
                signal,
            })

            if (response.error) {
                throw response.error
            }

            return response.data
        },
        enabled: !!playlistId,
    })
}
