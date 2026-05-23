import styles from './EditPlaylistForm.module.css'
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {
    SchemaGetPlaylistOutput,
    SchemaGetPlaylistsOutput,
    SchemaUpdatePlaylistRequestPayload
} from "../../../../shared/api/schema.ts";
import {usePlaylistQuery} from "../api/use-playlist-query.tsx";
import {type EditPlaylistFormValues, validateEditPlaylistForm} from "./edit-playlist-form.validation.ts";
import {useUpdatePlaylistMutation} from "../api/use-update-playlist-mutation.ts";

type Props = {
    playlistId: string | null
    onClose: () => void
}

export const EditPlaylistForm = ({playlistId, onClose}: Props) => {
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

    const {data, isPending, isError} = usePlaylistQuery(playlistId)

    useEffect(() => {
        if (!data?.data.attributes) return

        reset({
            title: data.data.attributes.title,
            description: data.data.attributes.description ?? ""
        })
    }, [data, reset])

    const {mutateAsync} = useUpdatePlaylistMutation(playlistId)

    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error && error.message) {
            return error.message
        }

        return "Could not save the playlist. Please try again."
    }

    const onSubmit = async (values: EditPlaylistFormValues) => {
        setSubmitError(null)
        clearErrors()

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
            await mutateAsync(payload)
        } catch (error) {
            setSubmitError(getErrorMessage(error))
        }
    }

    if (!playlistId) return <></>

    if (isPending) {
        return <div className={styles.overlay}>
            <div className={styles.statusCard}>Loading...</div>
        </div>
    }

    if (isError) {
        return <div className={styles.overlay}>
            <div className={styles.statusCard}>Some Error...</div>
        </div>
    }

    return <div className={styles.overlay} onClick={onClose}>
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.form}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-playlist-title"
            onClick={e => e.stopPropagation()}
        >
            <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close edit dialog"
                disabled={isSubmitting}
            >
                ×
            </button>
            <h2 id="edit-playlist-title" className={styles.title}>Edit Playlist</h2>
            {submitError && (
                <div className={styles.submitError} role="alert">
                    {submitError}
                </div>
            )}
            <p className={styles.field}>
                <input
                    {...register("title", {
                        onChange: () => setSubmitError(null)
                    })}
                    className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                    aria-invalid={!!errors.title}
                    disabled={isSubmitting}
                />
                {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
            </p>
            <p className={styles.field}>
                <textarea
                    {...register("description", {
                        onChange: () => setSubmitError(null)
                    })}
                    className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                    aria-invalid={!!errors.description}
                    disabled={isSubmitting}
                />
                {errors.description && <span className={styles.fieldError}>{errors.description.message}</span>}
            </p>
            <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
            </button>
        </form>
    </div>
}
