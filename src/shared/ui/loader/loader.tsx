import styles from './loader.module.css'

type Props = {
    size?: 'small' | 'medium' | 'large'
    className?: string
}

export const Loader = ({ size = 'medium', className }: Props) => {
    const sizeClass = {
        small: styles.loaderSmall,
        medium: styles.loaderMedium,
        large: styles.loaderLarge,
    }[size]

    return (
        <div className={`${styles.loader} ${sizeClass} ${className ?? ''}`}>
            <div className={styles.spinner} />
        </div>
    )
}
