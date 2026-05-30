import styles from './AddPlaylistForm.module.css'
import {useState} from "react";
import {useForm} from "react-hook-form";
import type {SchemaCreatePlaylistRequestPayload} from "../../../../shared/api/schema.ts";
import {useAddPlaylistMutation} from "../api/addPlaylistMutation.ts";

type AddPlaylistFormValues = {
    title: string
    description: string
}

type Props = {
    isOpen: boolean
    onClose: () => void
}

export const AddPlaylistForm = ({isOpen, onClose}: Props) => {
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {handleSubmit, register, reset, formState: {isSubmitting}} = useForm<AddPlaylistFormValues>()

    const {mutateAsync} = useAddPlaylistMutation()

    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error && error.message) {
            return error.message
        }

        return "Ambush by the Cardinal's guards! Please try again."
    }

    const onSubmit = async (values: AddPlaylistFormValues) => {
        setSubmitError(null)

        const payload: SchemaCreatePlaylistRequestPayload = {
            data: {
                type: "playlists",
                attributes: {
                    title: values.title.trim(),
                    description: values.description.trim() || null,
                }
            }
        }

        try {
            await mutateAsync(payload)
            reset()
            onClose()
        } catch (error) {
            setSubmitError(getErrorMessage(error))
        }
    }

    if (!isOpen) {
        return null
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.form}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-playlist-title"
                onClick={e => e.stopPropagation()}
            >
                <button
                    type="button"
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close add dialog"
                    disabled={isSubmitting}
                >
                    ×
                </button>
                <h2 id="add-playlist-title" className={styles.title}>Add New Playlist</h2>
                {submitError && (
                    <div className={styles.submitError} role="alert">
                        {submitError}
                    </div>
                )}
                <p className={styles.field}>
                    <input {...register("title")} className={styles.input} disabled={isSubmitting}/>
                </p>
                <p className={styles.field}>
                    <textarea {...register("description")} className={styles.textarea} disabled={isSubmitting}/>
                </p>
                <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create"}
                </button>
            </form>
        </div>
    )
}
