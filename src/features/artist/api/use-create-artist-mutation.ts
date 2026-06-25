import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import type {SchemaCreateArtistRequestPayload} from "../../../shared/api/schema.ts";
import {artistsKeys} from "../../../shared/api/keys-factories/artists-keys-factory.ts";

export const useCreateArtistMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: SchemaCreateArtistRequestPayload) => {
            const response = await client.POST('/artists', {body: data})

            if (response.error) {
                throw response.error
            }

            return response.data
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: artistsKeys.all})
        },
    })
}
