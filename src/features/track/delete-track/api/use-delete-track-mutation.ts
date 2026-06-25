import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import {tracksKeys} from "../../../../shared/api/keys-factories/tracks-keys-factory.ts";

export const useDeleteTrackMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (trackId: string) => {
            const response = await client.DELETE('/playlists/tracks/{trackId}', {
                params: {path: {trackId}},
            })

            if (response.error) {
                throw response.error
            }
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: (_, trackId) => {
            queryClient.removeQueries({queryKey: tracksKeys.detail(trackId)})
            queryClient.invalidateQueries({queryKey: tracksKeys.lists()})
        },
    })
}
