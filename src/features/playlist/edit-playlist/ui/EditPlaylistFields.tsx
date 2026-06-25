import type {FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch} from "react-hook-form";
import styles from "./EditPlaylistForm.module.css";
import type {EditPlaylistFormValues} from "./edit-playlist-form.validation.ts";
import {TagSearchInput} from "../../../tag/ui/TagSearchInput.tsx";
import {useCreateTagMutation} from "../../../tag/api/use-create-tag-mutation.ts";
import {toast} from "react-toastify";

type Tag = { id: string; type: string; attributes: { name: string } }

type Props = {
    register: UseFormRegister<EditPlaylistFormValues>
    errors: FieldErrors<EditPlaylistFormValues>
    isSubmitting: boolean
    submitError: string | null
    onClearSubmitError: () => void
    setValue: UseFormSetValue<EditPlaylistFormValues>
    watch: UseFormWatch<EditPlaylistFormValues>
}

export const EditPlaylistFields = ({
    register,
    errors,
    isSubmitting,
    submitError,
    onClearSubmitError,
    setValue,
    watch,
}: Props) => {
    const tagIds = watch("tagIds") ?? []
    const createTagMutation = useCreateTagMutation()

    const handleTagAdd = (tag: Tag) => {
        if (tagIds.length >= 5) {
            toast.warn("Maximum 5 tags allowed")
            return
        }
        setValue("tagIds", [...tagIds, tag.id], {shouldValidate: true})
    }

    const handleTagRemove = (tagId: string) => {
        setValue("tagIds", tagIds.filter(id => id !== tagId), {shouldValidate: true})
    }

    const handleTagCreate = async (name: string) => {
        try {
            const tag = await createTagMutation.mutateAsync({
                data: {type: "tags", attributes: {name: name.trim()}}
            })
            handleTagAdd(tag as Tag)
        } catch {
            toast.error("Failed to create tag")
        }
    }

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
            <p className={styles.field}>
                <label style={{display: "block", marginBottom: 4, fontSize: "0.85rem", color: "var(--text-soft)"}}>Tags</label>
                <TagSearchInput
                    selectedTags={[]}
                    onAdd={handleTagAdd}
                    onRemove={handleTagRemove}
                    onCreate={handleTagCreate}
                />
                {errors.tagIds && <span className={styles.fieldError}>{errors.tagIds.message}</span>}
            </p>
            <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
            </button>
        </>
    )
}
