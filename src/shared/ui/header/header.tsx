import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import styles from './header.module.css'

type Props = {
    renderAccountBar: () => ReactNode
}

export const Header = ({ renderAccountBar }: Props) => (
    <header className={styles.header}>
        <div className={styles.container}>
            <nav className={styles.linksBlock} aria-label="Main navigation">
                <Link
                    to="/"
                    className={styles.link}
                    activeProps={{ className: `${styles.link} ${styles.linkActive}` }}
                >
                    Playlists
                </Link>
            </nav>

            <div className={styles.account}>{renderAccountBar()}</div>
        </div>
    </header>
)
