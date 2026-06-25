import {useEffect, useState} from "react";
import {type Path, useForm} from "react-hook-form";
import type {SchemaUpdatePlaylistRequestPayload} from "../../../../shared/api/schema.ts";
import {usePlaylistQuery} from "../api/use-playlist-query.tsx";
import {useUpdatePlaylistMutation} from "../api/use-update-playlist-mutation.ts";
import {type EditPlaylistFormValues, validateEditPlaylistForm} from "../ui/edit-playlist-form.validation.ts";
import {queryErrorHandlerForRHFFactory} from "../../../../shared/api/query-error-handlers.ts";

type UseEditPlaylistFormArgs = {
    playlistId: string | null
    onClose: () => void
}

export const useEditPlaylistForm = ({playlistId, onClose}: UseEditPlaylistFormArgs) => {
    const [submitError, setSubmitError] = useState<string | null>(null)
    const {
        handleSubmit,
        register,
        reset,
        setError,
        clearErrors,
        setValue,
        watch,
        formState: {errors, isSubmitting}
    } = useForm<EditPlaylistFormValues>({
        defaultValues: {
            title: "",
            description: "",
            tagIds: [],
        }
    })

    useEffect(() => {
        reset()
        clearErrors()
    }, [playlistId, reset, clearErrors]);

    const playlistQuery = usePlaylistQuery(playlistId)

    useEffect(() => {
        if (!playlistQuery.data?.data.attributes) return

        reset({
            title: playlistQuery.data.data.attributes.title,
            description: playlistQuery.data.data.attributes.description ?? "",
            tagIds: playlistQuery.data.data.attributes.tags?.map(t => t.id) ?? [],
        })
    }, [playlistQuery.data, reset])

    const {mutateAsync} = useUpdatePlaylistMutation()
    const handleServerError = queryErrorHandlerForRHFFactory<EditPlaylistFormValues>({setError})

    const submit = async (values: EditPlaylistFormValues) => {
        setSubmitError(null)
        clearErrors()

        if (!playlistId) {
            setSubmitError("Ambush by the Cardinal's guards! playlistId is missing.")
            return
        }

        const validationResult = validateEditPlaylistForm(values)

        if (!validationResult.success) {
            validationResult.error.issues.forEach(issue => {
                const field = issue.path[0]

                if (field === "title" || field === "description" || field === "tagIds") {
                    setError(field, {
                        type: "zod",
                        message: issue.message
                    })
                }
            })

            return
        }

        const payload: SchemaUpdatePlaylistRequestPayload = {
            data: {
                type: "playlists",
                attributes: {
                    title: validationResult.data.title,
                    description: validationResult.data.description || null,
                    tagIds: validationResult.data.tagIds,
                }
            }
        }

        try {
            await mutateAsync({
                playlistId,
                ...payload,
            })
            onClose()
        } catch (error) {
            if (handleServerError(error)) {
                return
            }

            setError("root.server" as Path<EditPlaylistFormValues>, {
                type: "server",
                message: "Ambush by the Cardinal's guards! Please try again.",
            })
        }
    }

    return {
        playlistQuery,
        submitError: errors.root?.server?.message ?? submitError,
        register,
        errors,
        isSubmitting,
        onSubmit: handleSubmit(submit),
        clearSubmitError: () => {
            setSubmitError(null)
            clearErrors("root")
        },
        setValue,
        watch,
    }
}
