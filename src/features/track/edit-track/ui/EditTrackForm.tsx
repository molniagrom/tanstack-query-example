import styles from './EditTrackForm.module.css'
import {useEffect, useState} from "react";
import {type Path, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {type EditTrackFormValues, validateEditTrackForm} from "./edit-track-form.validation.ts";
import {useTrackDetailsQuery} from "../api/use-track-details-query.ts";
import {useUpdateTrackMutation} from "../api/use-update-track-mutation.ts";
import {queryErrorHandlerForRHFFactory} from "../../../../shared/api/query-error-handlers.ts";

type Props = {
    trackId: string | null
    onClose: () => void
}

export const EditTrackForm = ({trackId, onClose}: Props) => {
    const {
        handleSubmit,
        register,
        reset,
        setError,
        clearErrors,
        formState: {errors, isSubmitting},
    } = useForm<EditTrackFormValues>({
        defaultValues: {
            title: "",
            lyrics: "",
            releaseDate: null,
            tagIds: [],
            artistsIds: [],
        },
    })

    const trackQuery = useTrackDetailsQuery(trackId)
    const {mutateAsync} = useUpdateTrackMutation()
    const handleServerError = queryErrorHandlerForRHFFactory<EditTrackFormValues>({setError})
    const [submitError, setSubmitError] = useState<string | null>(null)

    useEffect(() => {
        if (!trackQuery.data?.data.attributes) return

        const attrs = trackQuery.data.data.attributes
        reset({
            title: attrs.title,
            lyrics: attrs.lyrics ?? "",
            releaseDate: attrs.releaseDate ?? null,
            tagIds: attrs.tags?.map(t => t.id) ?? [],
            artistsIds: attrs.artists?.map(a => a.id) ?? [],
        })
    }, [trackQuery.data, reset])

    const onSubmit = async (values: EditTrackFormValues) => {
        setSubmitError(null)
        clearErrors()

        if (!trackId) return

        const validationResult = validateEditTrackForm(values)
        if (!validationResult.success) {
            validationResult.error.issues.forEach(issue => {
                const field = issue.path[0]
                if (field === "title" || field === "lyrics") {
                    setError(field, {type: "zod", message: issue.message})
                }
            })
            return
        }

        try {
            await mutateAsync({
                trackId,
                data: {
                    type: "tracks",
                    attributes: {
                        title: validationResult.data.title,
                        lyrics: validationResult.data.lyrics || null,
                        releaseDate: validationResult.data.releaseDate || null,
                        tagIds: validationResult.data.tagIds,
                        artistsIds: validationResult.data.artistsIds,
                    },
                },
            })
            toast.success("Track updated")
            onClose()
        } catch (error) {
            if (handleServerError(error)) return
            setSubmitError("Failed to update track")
        }
    }

    if (!trackId) return null

    if (trackQuery.isPending) {
        return (
            <div className={styles.overlay}>
                <div className={styles.statusCard}>Loading...</div>
            </div>
        )
    }

    if (trackQuery.isError) {
        return (
            <div className={styles.overlay}>
                <div className={styles.statusCard}>Failed to load track</div>
            </div>
        )
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.form}
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-track-title"
                onClick={e => e.stopPropagation()}
            >
                <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close" disabled={isSubmitting}>×</button>
                <h2 id="edit-track-title" className={styles.title}>Edit Track</h2>

                {submitError && (
                    <div className={styles.submitError} role="alert">{submitError}</div>
                )}

                <p className={styles.field}>
                    <label className={styles.label}>Title</label>
                    <input
                        {...register("title")}
                        className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                        aria-invalid={!!errors.title}
                        disabled={isSubmitting}
                    />
                    {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
                </p>

                <p className={styles.field}>
                    <label className={styles.label}>Lyrics</label>
                    <textarea
                        {...register("lyrics")}
                        className={`${styles.textarea} ${errors.lyrics ? styles.inputError : ''}`}
                        aria-invalid={!!errors.lyrics}
                        disabled={isSubmitting}
                    />
                    {errors.lyrics && <span className={styles.fieldError}>{errors.lyrics.message}</span>}
                </p>

                <p className={styles.field}>
                    <label className={styles.label}>Release Date</label>
                    <input
                        type="date"
                        {...register("releaseDate")}
                        className={styles.input}
                        disabled={isSubmitting}
                    />
                </p>

                <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
            </form>
        </div>
    )
}
