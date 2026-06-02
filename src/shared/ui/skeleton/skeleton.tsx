import styles from './skeleton.module.css'

type Props = {
    width?: string | number
    height?: string | number
    borderRadius?: string
    className?: string
    animate?: boolean
}

export const Skeleton = ({
    width = '100%',
    height = '20px',
    borderRadius = '4px',
    className,
    animate = true,
}: Props) => {
    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
    }

    return (
        <div
            className={`${styles.skeleton} ${animate ? styles.animate : ''} ${className ?? ''}`}
            style={style}
        />
    )
}
