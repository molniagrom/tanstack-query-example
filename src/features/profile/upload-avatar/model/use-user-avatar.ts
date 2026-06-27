import { useCallback, useEffect, useState } from "react"

const AVATAR_MAX_SIZE = 5 * 1024 * 1024
const STORAGE_PREFIX = "user-avatar-"

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`
}

export const useUserAvatar = (userId: string | undefined) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!userId) {
      setAvatarUrl(null)
      return
    }
    const stored = localStorage.getItem(getStorageKey(userId))
    setAvatarUrl(stored)
  }, [userId])

  const setAvatar = useCallback(
    (file: File) => {
      if (!userId) return

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file")
      }

      if (file.size > AVATAR_MAX_SIZE) {
        throw new Error("Image must be less than 5MB")
      }

      setIsUploading(true)

      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result as string
        localStorage.setItem(getStorageKey(userId), dataUrl)
        setAvatarUrl(dataUrl)
        setIsUploading(false)
      }
      reader.onerror = () => {
        setIsUploading(false)
        throw new Error("Failed to read file")
      }
      reader.readAsDataURL(file)
    },
    [userId],
  )

  const removeAvatar = useCallback(() => {
    if (!userId) return
    localStorage.removeItem(getStorageKey(userId))
    setAvatarUrl(null)
  }, [userId])

  return { avatarUrl, setAvatar, removeAvatar, isUploading }
}
