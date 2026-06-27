import { useRef, useState } from "react"
import { toast } from "react-toastify"
import { useUserAvatar } from "../model/use-user-avatar.ts"
import styles from "./UploadAvatar.module.css"

type Props = {
  userId: string
  login: string
}

export const UploadAvatar = ({ userId, login }: Props) => {
  const { avatarUrl, setAvatar, removeAvatar, isUploading } = useUserAvatar(userId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    try {
      setAvatar(file)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload avatar"
      setError(message)
      toast.error(message)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={styles.container}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="User avatar" className={styles.avatar} />
      ) : (
        <div className={styles.placeholder}>
          {login.charAt(0).toUpperCase()}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.uploadButton}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Avatar"}
        </button>

        {avatarUrl && (
          <button
            type="button"
            className={styles.removeButton}
            onClick={removeAvatar}
            disabled={isUploading}
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.fileInput}
        aria-hidden="true"
      />

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
