import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './upload-playlist-image.module.css'
import { useUploadPlaylistImage } from '../api/use-upload-playlist-image'

type Props = {
    playlistId: string
    onUploadComplete?: () => void
}

// Функция проверки, что картинка квадратная
const validateSquareImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image()
        const url = URL.createObjectURL(file)
        
        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve(img.width === img.height)
        }
        
        img.onerror = () => {
            URL.revokeObjectURL(url)
            resolve(false)
        }
        
        img.src = url
    })
}

export const UploadPlaylistImage = ({ playlistId, onUploadComplete }: Props) => {
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const { mutate: uploadImage } = useUploadPlaylistImage()

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Валидация файла
        if (!file.type.startsWith('image/')) {
            const errorMsg = 'Please select an image file'
            setError(errorMsg)
            toast.error(errorMsg)
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            const errorMsg = 'Image must be less than 5MB'
            setError(errorMsg)
            toast.error(errorMsg)
            return
        }

        // Проверка, что картинка квадратная
        try {
            const isValidSquare = await validateSquareImage(file)
            if (!isValidSquare) {
                const errorMsg = 'Image must be square (width = height)'
                setError(errorMsg)
                toast.error(errorMsg)
                return
            }
        } catch {
            const errorMsg = 'Failed to validate image'
            setError(errorMsg)
            toast.error(errorMsg)
            return
        }

        setError(null)
        setIsUploading(true)
        setProgress(0)

        uploadImage(
            {
                playlistId,
                file,
                onProgress: (progressValue) => {
                    setProgress(progressValue)
                }
            },
            {
                onSuccess: () => {
                    setIsUploading(false)
                    setProgress(100)
                    onUploadComplete?.()
                    // Сбрасываем input для возможности повторной загрузки того же файла
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                },
                onError: (err) => {
                    const errorMessage = err.message || 'Failed to upload image'
                    setIsUploading(false)
                    setError(errorMessage)
                    toast.error(errorMessage)
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                    }
                }
            }
        )
    }

    return (
        <div className={styles.container}>
            <button
                type="button"
                className={styles.uploadButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                aria-label="Upload playlist image"
                title="Upload playlist image"
            >
                {isUploading ? `${progress}%` : '📷'}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className={styles.fileInput}
                aria-hidden="true"
            />

            {isUploading && (
                <div className={styles.progressBar}>
                    <div 
                        className={styles.progressFill} 
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {error && (
                <div className={styles.error} role="alert">
                    {error}
                </div>
            )}
        </div>
    )
}
