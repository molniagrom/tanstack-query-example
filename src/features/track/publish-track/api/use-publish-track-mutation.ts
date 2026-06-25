import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import {tracksKeys} from "../../../../shared/api/keys-factories/tracks-keys-factory.ts";

export const usePublishTrackMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (trackId: string) => {
            const response = await client.POST('/playlists/tracks/{trackId}/actions/publish', {
                params: {path: {trackId}},
            })

            if (response.error) {
                throw response.error
            }
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: (_, trackId) => {
            queryClient.invalidateQueries({queryKey: tracksKeys.detail(trackId)})
            queryClient.invalidateQueries({queryKey: tracksKeys.lists()})
        },
    })
}
