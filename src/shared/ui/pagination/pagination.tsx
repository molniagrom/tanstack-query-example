import styles from './pagination.module.css'
import { PaginationNav } from './pagination-nav'
import { ProgressBar } from '../progress-bar'

type Props = {
    currentPage: number
    pagesCount: number
    onPageNumberChange: (page: number) => void
    isFetching: boolean
}

export const Pagination = ({ currentPage, pagesCount, onPageNumberChange, isFetching }: Props) => {
    return (
        <div className={styles.container}>
            {isFetching && <ProgressBar className={styles.progressBar} />}

            <div className={styles.controls}>
                <PaginationNav current={currentPage} pagesCount={pagesCount} onChange={onPageNumberChange} />

                {isFetching && (
                    <div className={styles.statusBadge} aria-live="polite">
                        <span className={styles.statusDot} aria-hidden="true" />
                        Refreshing
                    </div>
                )}
            </div>
        </div>
    )
}
