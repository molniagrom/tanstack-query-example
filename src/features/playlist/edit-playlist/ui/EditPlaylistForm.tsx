import styles from './EditPlaylistForm.module.css'
import {EditPlaylistFields} from "./EditPlaylistFields.tsx";
import {useEditPlaylistForm} from "../model/useEditPlaylistForm.ts";

type Props = {
    playlistId: string | null
    onClose: () => void
}

export const EditPlaylistForm = ({playlistId, onClose}: Props) => {
    const {
        playlistQuery,
        submitError,
        register,
        errors,
        isSubmitting,
        onSubmit,
        clearSubmitError,
    } = useEditPlaylistForm({playlistId, onClose})

    if (!playlistId) return <></>

    if (playlistQuery.isPending) {
        return <div className={styles.overlay}>
            <div className={styles.statusCard}>Loading...</div>
        </div>
    }

    if (playlistQuery.isError) {
        return <div className={styles.overlay}>
            <div className={styles.statusCard}>Some Error...</div>
        </div>
    }

    return <div className={styles.overlay} onClick={onClose}>
        <form
            onSubmit={onSubmit}
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
            <EditPlaylistFields
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onClearSubmitError={clearSubmitError}
            />
        </form>
    </div>
}
