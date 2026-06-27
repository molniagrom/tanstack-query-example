import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {tracksKeys} from "../../../../shared/api/keys-factories/tracks-keys-factory.ts";
import {localStorageKeys} from "../../../../shared/config/localStorage-keys.ts";
import {baseUrl, apiKey} from "../../../../shared/config/api-config.ts";

type UploadTrackParams = {
    title: string
    file: File
    onProgress?: (progress: number) => void
}

let refreshPromise: Promise<void> | null = null

async function refreshAccessToken(): Promise<void> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            const refreshToken = localStorage.getItem(localStorageKeys.refreshToken)
            if (!refreshToken) throw new Error('No refresh token')

            const response = await axios.post(`${baseUrl}auth/refresh`, {refreshToken}, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(apiKey ? {'API-KEY': apiKey} : {}),
                },
            })

            localStorage.setItem(localStorageKeys.accessToken, response.data.accessToken)
            localStorage.setItem(localStorageKeys.refreshToken, response.data.refreshToken)
        })()

        refreshPromise.finally(() => {
            refreshPromise = null
        })
    }

    return refreshPromise
}

async function uploadTrack(title: string, file: File, onProgress?: (progress: number) => void): Promise<unknown> {
    const formData = new FormData()
    formData.append('data[type]', 'tracks')
    formData.append('data[attributes][title]', title)
    formData.append('file', file)

    const headers: Record<string, string> = {}
    const accessToken = localStorage.getItem(localStorageKeys.accessToken)
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
    if (apiKey) headers['api-key'] = apiKey

    const response = await axios.post(`${baseUrl}playlists/tracks/upload`, formData, {
        headers,
        onUploadProgress: (event) => {
            if (event.total && onProgress) {
                onProgress(Math.round((event.loaded / event.total) * 100))
            }
        },
    })

    return response.data
}

export const useUploadTrackMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        meta: {globalErrorHandler: 'off'},
        mutationFn: async ({title, file, onProgress}: UploadTrackParams) => {
            try {
                return await uploadTrack(title, file, onProgress)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    await refreshAccessToken()
                    return await uploadTrack(title, file, onProgress)
                }
                throw error
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: tracksKeys.lists()})
        },
    })
}
