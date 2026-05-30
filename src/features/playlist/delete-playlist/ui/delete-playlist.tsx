import {useDeleteMutation} from "../api/use-delete-mutation.ts";
import styles from "./delete-playlist.module.css";

type Props = {
    playlistId: string
    onDelete: (playlistId: string) => void
}

export const DeletePlaylist = ({playlistId, onDelete}: Props) => {
    const {mutate} = useDeleteMutation();

    const handleDeleteClick = () => {
        mutate(playlistId);
        onDelete?.(playlistId)
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
