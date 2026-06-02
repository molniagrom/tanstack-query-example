import { useMutation, useQueryClient } from "@tanstack/react-query"
import { playlistsKeys } from "../../../../shared/api/keys-factories/playlists-keys-factory.ts"
import { localStorageKeys } from "../../../../shared/config/localStorage-keys.ts"
import { baseUrl, apiKey } from "../../../../shared/config/api-config.ts"

type UploadImageParams = {
    playlistId: string
    file: File
    onProgress?: (progress: number) => void
}

export const useUploadPlaylistImage = () => {
    const queryClient = useQueryClient()

    const uploadWithXHR = (playlistId: string, file: File, onProgress?: (progress: number) => void): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('file', file)

            const xhr = new XMLHttpRequest()
            
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    const progress = Math.round((event.loaded / event.total) * 100)
                    onProgress(progress)
                }
            })

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText)
                        resolve(response)
                    } catch {
                        resolve(null)
                    }
                } else if (xhr.status === 401) {
                    // Специальная обработка для 401 - токен мог истечь
                    reject(new Error('Unauthorized'))
                } else {
                    try {
                        const error = JSON.parse(xhr.responseText)
                        reject(new Error(error.message || error.errors?.[0]?.detail || 'Upload failed'))
                    } catch {
                        reject(new Error('Upload failed'))
                    }
                }
            })

            xhr.addEventListener('error', () => {
                reject(new Error('Network error'))
            })

            xhr.open('POST', `${baseUrl}playlists/${playlistId}/images/main`)
            
            // Добавляем заголовки
            const accessToken = localStorage.getItem(localStorageKeys.accessToken)
            if (accessToken) {
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
            }
            if (apiKey && import.meta.env.DEV) {
                xhr.setRequestHeader('api-key', apiKey)
            }

            console.log('Uploading image for playlist:', playlistId)
            console.log('Access token exists:', !!accessToken)
            console.log('Base URL:', baseUrl)

            xhr.send(formData)
        })
    }

    return useMutation({
        meta: {
            globalErrorHandler: 'off'
        },
        mutationFn: async ({ playlistId, file, onProgress }: UploadImageParams) => {
            try {
                return await uploadWithXHR(playlistId, file, onProgress)
            } catch (error) {
                // Если получили 401, пробуем обновить токен и повторить запрос
                if (error instanceof Error && error.message === 'Unauthorized') {
                    console.log('Got 401, trying to refresh token...')
                    try {
                        // Используем makeRefreshToken из client.ts
                        const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
                        if (!refreshToken) throw new Error('No refresh token')

                        const response = await fetch(`${baseUrl}auth/refresh`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ refreshToken }),
                        })

                        if (!response.ok) {
                            localStorage.removeItem(localStorageKeys.accessToken)
                            localStorage.removeItem(localStorageKeys.refreshToken)
                            throw new Error('Refresh token failed')
                        }

                        const data = await response.json()
                        localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
                        localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)

                        console.log('Token refreshed, retrying upload...')
                        // Повторяем запрос с новым токеном
                        return await uploadWithXHR(playlistId, file, onProgress)
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError)
                        throw refreshError
                    }
                }
                throw error
            }
        },

        onSuccess: (_, { playlistId }) => {
            // Инвалидируем запросы для обновления UI
            queryClient.invalidateQueries({ 
                queryKey: playlistsKeys.lists() 
            })
            queryClient.invalidateQueries({ 
                queryKey: playlistsKeys.detail(playlistId) 
            })
        }
    })
}
