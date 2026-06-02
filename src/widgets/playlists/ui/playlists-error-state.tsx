import styles from './playlists.module.css'

type Props = {
    message: string
}

export const PlaylistsErrorState = ({ message }: Props) => {
    return (
        <div className={`${styles.stateCard} ${styles.stateCardError}`}>
            Ambush by the Cardinal's guards! {message}
        </div>
    )
}
