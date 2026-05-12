
import styles from './paginationNav.module.css'
import { getPaginationPages } from '../utils/getPaginationPages.ts'

type Props = {
    current: number
    pagesCount: number
    onChange: (page: number) => void
    isFetching?: boolean
}

const SIBLING_COUNT = 1

export const PaginationNav = ({ current, pagesCount, onChange }: Props) => {
    const pages = getPaginationPages(current, pagesCount, SIBLING_COUNT)

    return (
        <div className={styles.pagination}>
            {pages.map((item, idx) =>
                item === '...' ? (
                    <span className={styles.ellipsis} key={`ellipsis-${idx}`}>
                        ...
                    </span>
                ) : (
                    <button
                        key={item}
                        className={item === current ? `${styles.pageButton} ${styles.pageButtonActive}` : styles.pageButton}
                        onClick={() => item !== current && onChange(Number(item))}
                        disabled={item === current}
                        type="button"
                    >
                        {item}
                    </button>
                )
            )}
        </div>
    )
}
