import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import styles from './header.module.css'

type Props = {
    renderAccountBar: () => ReactNode
}

export const Header = ({ renderAccountBar }: Props) => (
    <header className={styles.header}>
        <div className={styles.container}>
            <div className={styles.brand}>
                <span className={styles.brandMark} aria-hidden="true">⚜</span>
                <div className={styles.brandCopy}>
                    <span className={styles.brandEyebrow}>Royal Cabinet</span>
                    <nav className={styles.linksBlock} aria-label="Main navigation">
                        <Link
                            to="/"
                            className={styles.link}
                            activeProps={{ className: `${styles.link} ${styles.linkActive}` }}
                        >
                            Playlists
                        </Link>
                    </nav>
                </div>
            </div>

            <div className={styles.account}>{renderAccountBar()}</div>
        </div>
    </header>
)
