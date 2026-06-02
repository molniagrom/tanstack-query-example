import styles from './playlists.module.css'

type Props = {
    value: string
    onChange: (value: string) => void
}

export const PlaylistsSearch = ({ value, onChange }: Props) => {
    return (
        <div className={styles.searchRow}>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="Search..."
                className={styles.searchInput}
            />
        </div>
    )
}
