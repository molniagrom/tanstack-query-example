import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import {tagsKeys} from "../../../shared/api/keys-factories/tags-keys-factory.ts";

export const useDeleteTagMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (tagId: string) => {
            const response = await client.DELETE('/tags/{id}', {
                params: {path: {id: tagId}}
            })

            if (response.error) {
                throw response.error
            }
        },
        meta: {globalErrorHandler: "off"},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: tagsKeys.all})
        },
    })
}
