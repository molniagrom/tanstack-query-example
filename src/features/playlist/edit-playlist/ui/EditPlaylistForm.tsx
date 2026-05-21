import styles from './EditPlaylistForm.module.css'
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {SchemaUpdatePlaylistRequestPayload} from "../../../../shared/api/schema.ts";

type EditPlaylistFormValues = {
    title: string
    description: string
}

type Props = {
    playlistId: string | null
    onClose: () => void
}

export const EditPlaylistForm = ({playlistId, onClose}: Props) => {

    const {handleSubmit, register, reset} = useForm<EditPlaylistFormValues>()

    useEffect(() => {
        reset();
    }, [playlistId]);

    const {data, isPending, isError} = useQuery({
        queryKey: ['playlists', playlistId],
        queryFn: async () => {
            const response = await client.GET("/playlists/{playlistId}", {
                params: {
                    path: {
                        playlistId: playlistId!
                    }
                }
            })
            return response.data!
        },
        enabled: !!playlistId,
    })

    useEffect(() => {
        if (!data?.data.attributes) return

        reset({
            title: data.data.attributes.title,
            description: data.data.attributes.description ?? ""
        })
    }, [data, reset])

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: async (data: SchemaUpdatePlaylistRequestPayload) => {
            if (!playlistId) {
                throw new Error("playlistId is required");
            }

            const response = await client.PUT("/playlists/{playlistId}", {
                params: {
                    path: {playlistId: playlistId}
                },
                body: {...data, tagIds: []}
            })

            return response.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['playlists'],
                refetchType: "all"
            })
            onClose()
        }
    })

    const onSubmit = (values: EditPlaylistFormValues) => {
        const payload: SchemaUpdatePlaylistRequestPayload = {
            data: {
                type: "playlists",
                attributes: {
                    title: values.title.trim(),
                    description: values.description.trim() || null,
                    tagIds: []
                }
            }
        }

        mutate(payload)
    }

    if (!playlistId) return <></>

    if (isPending) {
        return <div className={styles.overlay}>
            <div className={styles.statusCard}>Loading...</div>
        </div>
    }

    if (isError) {
        return <div className={styles.overlay}>
            <div className={styles.statusCard}>Some Error...</div>
        </div>
    }

    return <div className={styles.overlay} onClick={onClose}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} role="dialog" aria-modal="true"
              aria-labelledby="edit-playlist-title" onClick={e => e.stopPropagation()}>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close edit dialog">
                ×
            </button>
            <h2 id="edit-playlist-title" className={styles.title}>Edit Playlist</h2>
            <p className={styles.field}>
                <input {...register("title")} className={styles.input} defaultValue={data.data.attributes.title}/>
            </p>
            <p className={styles.field}>
                <textarea {...register("description")} className={styles.textarea}
                          defaultValue={data.data.attributes.description!}/>
            </p>
            <button className={styles.submitButton} type={"submit"}>Save</button>
        </form>
    </div>
}
