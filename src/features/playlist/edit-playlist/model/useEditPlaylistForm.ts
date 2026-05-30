import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import type {SchemaUpdatePlaylistRequestPayload} from "../../../../shared/api/schema.ts";
import {usePlaylistQuery} from "../api/use-playlist-query.tsx";
import {useUpdatePlaylistMutation} from "../api/use-update-playlist-mutation.ts";
import {type EditPlaylistFormValues, validateEditPlaylistForm} from "../ui/edit-playlist-form.validation.ts";

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
        formState: {errors, isSubmitting}
    } = useForm<EditPlaylistFormValues>({
        defaultValues: {
            title: "",
            description: "",
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
            description: playlistQuery.data.data.attributes.description ?? ""
        })
    }, [playlistQuery.data, reset])

    const {mutateAsync} = useUpdatePlaylistMutation()

    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error && error.message) {
            return error.message
        }

        return "Could not save the playlist. Please try again."
    }

    const submit = async (values: EditPlaylistFormValues) => {
        setSubmitError(null)
        clearErrors()

        if (!playlistId) {
            setSubmitError("Could not save the playlist: playlistId is missing.")
            return
        }

        const validationResult = validateEditPlaylistForm(values)

        if (!validationResult.success) {
            validationResult.error.issues.forEach(issue => {
                const field = issue.path[0]

                if (field === "title" || field === "description") {
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
                    tagIds: []
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
            setSubmitError(getErrorMessage(error))
        }
    }

    return {
        playlistQuery,
        submitError,
        register,
        errors,
        isSubmitting,
        onSubmit: handleSubmit(submit),
        clearSubmitError: () => setSubmitError(null),
    }
}
