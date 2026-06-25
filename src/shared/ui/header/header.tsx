import {Link} from '@tanstack/react-router'
import type {ReactNode} from 'react'
import styles from './header.module.css'
import {useTheme} from "../../lib/theme/use-theme.ts";

type Props = {
    renderAccountBar: () => ReactNode
}

export const Header = ({renderAccountBar}: Props) => {
    const {theme, toggleTheme} = useTheme()
    const nextTheme = theme === "light" ? "dark" : "light"

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <span className={styles.brandMark} aria-hidden="true">F</span>
                    <div className={styles.brandCopy}>
                        <span className={styles.brandEyebrow}>Royal Cabinet</span>
                        <nav className={styles.linksBlock} aria-label="Main navigation">
                            <Link
                                to="/"
                                className={styles.link}
                                activeProps={{className: `${styles.link} ${styles.linkActive}`}}
                            >
                                Playlists
                            </Link>
                            <Link
                                to="/tracks"
                                className={styles.link}
                                activeProps={{className: `${styles.link} ${styles.linkActive}`}}
                            >
                                Tracks
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.themeButton}
                        onClick={toggleTheme}
                        aria-label={`Switch to ${nextTheme} theme`}
                        title={`Switch to ${nextTheme} theme`}
                    >
                        <span
                            className={`${styles.themeIcon} ${theme === "light" ? styles.themeIconMoon : styles.themeIconSun}`}
                            aria-hidden="true"
                        />
                        <span>{theme === "light" ? "Dark" : "Light"}</span>
                    </button>
                    <div className={styles.account}>{renderAccountBar()}</div>
                </div>
            </div>
        </header>
    )
}
