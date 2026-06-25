import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import type {SchemaCreateTagRequestPayload} from "../../../shared/api/schema.ts";
import {tagsKeys} from "../../../shared/api/keys-factories/tags-keys-factory.ts";

export const useCreateTagMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: SchemaCreateTagRequestPayload) => {
            const response = await client.POST('/tags', {body: data})

            if (response.error) {
                throw response.error
            }

            return response.data.data
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: tagsKeys.all})
        },
    })
}
