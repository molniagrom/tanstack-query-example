import styles from './AddPlaylistForm.module.css'
import {useForm} from "react-hook-form";
import type {SchemaCreatePlaylistRequestPayload} from "../../../../shared/api/schema.ts";
import {useAddPlaylistMutation} from "../api/addPlaylistMutation.ts";

type AddPlaylistFormValues = {
    title: string
    description: string
}

export const AddPlaylistForm = () => {

    const {handleSubmit, register} = useForm<AddPlaylistFormValues>()


    const {mutate} = useAddPlaylistMutation()

    const onSubmit = (values: AddPlaylistFormValues) => {
        const payload: SchemaCreatePlaylistRequestPayload = {
            data: {
                type: "playlists",
                attributes: {
                    title: values.title.trim(),
                    description: values.description.trim() || null,
                }
            }
        }

        mutate(payload)
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
