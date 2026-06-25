import {useMutation, useQueryClient} from "@tanstack/react-query";
import {tracksKeys} from "../../../../shared/api/keys-factories/tracks-keys-factory.ts";
import {localStorageKeys} from "../../../../shared/config/localStorage-keys.ts";
import {baseUrl, apiKey} from "../../../../shared/config/api-config.ts";

type UploadTrackParams = {
    title: string
    file: File
    onProgress?: (progress: number) => void
}

export const useUploadTrackMutation = () => {
    const queryClient = useQueryClient()

    const uploadWithXHR = (title: string, file: File, onProgress?: (progress: number) => void): Promise<unknown> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('file', file)

            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    onProgress(Math.round((event.loaded / event.total) * 100))
                }
            })

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText))
                    } catch {
                        resolve(null)
                    }
                } else if (xhr.status === 401) {
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

            xhr.addEventListener('error', () => reject(new Error('Network error')))
            xhr.open('POST', `${baseUrl}playlists/tracks/upload`)

            const accessToken = localStorage.getItem(localStorageKeys.accessToken)
            if (accessToken) {
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
            }
            if (apiKey) {
                xhr.setRequestHeader('api-key', apiKey)
            }

            xhr.send(formData)
        })
    }

    return useMutation({
        meta: {globalErrorHandler: 'off'},
        mutationFn: async ({title, file, onProgress}: UploadTrackParams) => {
            try {
                return await uploadWithXHR(title, file, onProgress)
            } catch (error) {
                if (error instanceof Error && error.message === 'Unauthorized') {
                    const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
                    if (!refreshToken) throw new Error('No refresh token')

                    const response = await fetch(`${baseUrl}auth/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(apiKey ? {'API-KEY': apiKey} : {}),
                        },
                        body: JSON.stringify({refreshToken}),
                    })

                    if (!response.ok) {
                        localStorage.removeItem(localStorageKeys.accessToken)
                        localStorage.removeItem(localStorageKeys.refreshToken)
                        throw new Error('Refresh token failed')
                    }

                    const data = await response.json()
                    localStorage.setItem(localStorageKeys.accessToken, data.accessToken)
                    localStorage.setItem(localStorageKeys.refreshToken, data.refreshToken)

                    return await uploadWithXHR(title, file, onProgress)
                }
                throw error
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: tracksKeys.lists()})
        },
    })
}
