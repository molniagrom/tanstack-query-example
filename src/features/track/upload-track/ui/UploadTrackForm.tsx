import styles from './UploadTrackForm.module.css'
import {useRef, useState} from "react";
import {useUploadTrackMutation} from "../api/use-upload-track-mutation.ts";
import {toast} from "react-toastify";

type Props = {
    isOpen: boolean
    onClose: () => void
}

export const UploadTrackForm = ({isOpen, onClose}: Props) => {
    const [title, setTitle] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const {mutateAsync, isPending} = useUploadTrackMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !title.trim()) return

        try {
            await mutateAsync({
                title: title.trim(),
                file,
                onProgress: setProgress,
            })
            toast.success("Track uploaded successfully")
            setTitle("")
            setFile(null)
            setProgress(0)
            onClose()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed")
        }
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <form
                onSubmit={handleSubmit}
                className={styles.form}
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-track-title"
                onClick={e => e.stopPropagation()}
            >
                <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">×</button>
                <h2 id="upload-track-title" className={styles.title}>Upload Track</h2>

                <p className={styles.field}>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Track title"
                        className={styles.input}
                        disabled={isPending}
                        required
                    />
                </p>

                <p className={styles.field}>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".mp3"
                        onChange={e => setFile(e.target.files?.[0] ?? null)}
                        className={styles.fileInput}
                        disabled={isPending}
                        required
                    />
                    {file && <span className={styles.fileName}>{file.name}</span>}
                </p>

                {isPending && (
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: `${progress}%`}} />
                    </div>
                )}

                <button
                    className={styles.submitButton}
                    type="submit"
                    disabled={isPending || !title.trim() || !file}
                >
                    {isPending ? `Uploading... ${progress}%` : "Upload"}
                </button>
            </form>
        </div>
    )
}
