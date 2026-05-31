import styles from './AddPlaylistForm.module.css'
import {type Path, useForm} from "react-hook-form";
import type {SchemaCreatePlaylistRequestPayload} from "../../../../shared/api/schema.ts";
import {useAddPlaylistMutation} from "../api/addPlaylistMutation.ts";
import {queryErrorHandlerForRHFFactory} from "../../../../shared/api/query-error-handlers.ts";

type AddPlaylistFormValues = {
    title: string
    description: string
}

type Props = {
    isOpen: boolean
    onClose: () => void
}

export const AddPlaylistForm = ({isOpen, onClose}: Props) => {
    const {
        handleSubmit,
        register,
        reset,
        setError,
        clearErrors,
        formState: {errors, isSubmitting}
    } = useForm<AddPlaylistFormValues>()

    const {mutateAsync} = useAddPlaylistMutation()
    const handleServerError = queryErrorHandlerForRHFFactory<AddPlaylistFormValues>({setError})

    const onSubmit = async (values: AddPlaylistFormValues) => {
        clearErrors()

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
            if (handleServerError(error)) {
                return
            }

            setError("root.server" as Path<AddPlaylistFormValues>, {
                type: "server",
                message: "Ambush by the Cardinal's guards! Please try again.",
            })
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
                {errors.root?.server?.message && (
                    <div className={styles.submitError} role="alert">
                        {errors.root.server.message}
                    </div>
                )}
                <p className={styles.field}>
                    <input
                        {...register("title", {
                            onChange: () => clearErrors(),
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
                            onChange: () => clearErrors(),
                        })}
                        className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                        aria-invalid={!!errors.description}
                        disabled={isSubmitting}
                    />
                    {errors.description && <span className={styles.fieldError}>{errors.description.message}</span>}
                </p>
                <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create"}
                </button>
            </form>
        </div>
    )
}
