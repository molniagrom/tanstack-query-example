import styles from './progress-bar.module.css'

type Props = {
    className?: string
}

export const ProgressBar = ({ className }: Props) => {
    return (
        <div className={`${styles.progressBar} ${className ?? ''}`}>
            <div className={styles.indicator} />
        </div>
    )
}
