import styles from './AddPlaylistForm.module.css'
import {useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {client} from "../../../../shared/api/client.ts";
import type {SchemaCreatePlaylistRequestPayload} from "../../../../shared/api/schema.ts";

type AddPlaylistFormValues = {
    title: string
    description: string
}

export const AddPlaylistForm = () => {

    const {handleSubmit, register} = useForm<AddPlaylistFormValues>()

    const queryClient = useQueryClient()

    const {mutate} = useMutation({
        mutationFn: async (values: AddPlaylistFormValues) => {
            const payload = {
                data: {
                    type: "playlists",
                    attributes: {
                        title: values.title.trim(),
                        description: values.description.trim() || null,
                        type: "public",
                    }
                }
            }

            const response = await client.POST("/playlists", {
                body: payload as unknown as SchemaCreatePlaylistRequestPayload
            })

            return response.data
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['playlists'],
                refetchType: "all"
            })
        }
    })

    const onSubmit = (values: AddPlaylistFormValues) => {
        mutate(values)
    }

    return <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2 className={styles.title}>Add New Playlist</h2>
        <p className={styles.field}>
            <input {...register("title")} className={styles.input}/>
        </p>
        <p className={styles.field}>
            <textarea {...register("description")} className={styles.textarea}/>
        </p>
        <button className={styles.submitButton} type={"submit"}>Create</button>
    </form>
}
