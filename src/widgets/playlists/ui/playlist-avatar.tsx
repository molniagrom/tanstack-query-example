import styles from './playlist-avatar.module.css'

type ImageVariant = {
    type: string
    width: number
    height: number
    fileSize: number
    url: string
}

type Props = {
    images?: {
        main?: ImageVariant[]
    }
    title: string
}

export const PlaylistAvatar = ({ images, title }: Props) => {
    // Берем первую доступную картинку (thumbnail или original)
    const imageUrl = images?.main?.[0]?.url

    if (!imageUrl) {
        // Placeholder если картинки нет
        return (
            <div className={styles.avatar} aria-label={title}>
                <span className={styles.placeholder}>🎵</span>
            </div>
        )
    }

    return (
        <div className={styles.avatar}>
            <img 
                src={imageUrl} 
                alt={title}
                className={styles.image}
            />
        </div>
    )
}
