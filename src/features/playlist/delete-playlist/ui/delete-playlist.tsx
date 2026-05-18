import {useDeleteMutation} from "../api/use-delete-mutation.ts";
import styles from "./delete-playlist.module.css";

type Props = {
    playlistId: string
}

export const DeletePlaylist = ({playlistId}: Props) => {
    const {mutate} = useDeleteMutation(playlistId);

    const handleDeleteClick = () => {
        mutate();
    }

    return (
        <button
            type="button"
            className={styles.button}
            onClick={handleDeleteClick}
            aria-label="Delete playlist"
            title="Delete playlist"
        >
            🗑️
        </button>
    );
};
