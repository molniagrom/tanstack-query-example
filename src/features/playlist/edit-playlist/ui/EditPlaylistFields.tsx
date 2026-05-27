import type {FieldErrors, UseFormRegister} from "react-hook-form";
import styles from "./EditPlaylistForm.module.css";
import type {EditPlaylistFormValues} from "./edit-playlist-form.validation.ts";

type Props = {
    register: UseFormRegister<EditPlaylistFormValues>
    errors: FieldErrors<EditPlaylistFormValues>
    isSubmitting: boolean
    submitError: string | null
    onClearSubmitError: () => void
}

export const EditPlaylistFields = ({
    register,
    errors,
    isSubmitting,
    submitError,
    onClearSubmitError,
}: Props) => {
    return (
        <>
            {submitError && (
                <div className={styles.submitError} role="alert">
                    {submitError}
                </div>
            )}
            <p className={styles.field}>
                <input
                    {...register("title", {
                        onChange: onClearSubmitError
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
                        onChange: onClearSubmitError
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
        </>
    )
}
