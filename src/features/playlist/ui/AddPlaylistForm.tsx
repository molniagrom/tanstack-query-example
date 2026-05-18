import styles from './AddPlaylistForm.module.css'
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {client} from "../../../shared/api/client.ts";
import type {SchemaCreateArtistRequestPayload} from "../../../shared/api/schema.ts";

export const AddPlaylistForm = () => {

    const {handleSubmit} = useForm<SchemaCreateArtistRequestPayload>()

    const {mutate} = useMutation({
        mutationFn: async (data: SchemaCreateArtistRequestPayload) => {
           const response = await client.POST("/playlists", {
                body: data
            })

            return response.data
        }
    })

    const onSubmit = (data: SchemaCreateArtistRequestPayload) => {
        mutate(data)
    }

    return <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <h2 className={styles.title}>Add New Playlist</h2>
        <p className={styles.field}>
            <input className={styles.input}/>
        </p>
        <p className={styles.field}>
            <textarea className={styles.textarea}/>
        </p>
        <button className={styles.submitButton} type={"submit"}>Create</button>
    </form>
}
