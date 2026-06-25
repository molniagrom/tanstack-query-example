import {Outlet} from "@tanstack/react-router";
import {Header} from "../../shared/ui/header/header.tsx";
import s from "./root-layout.module.css"
import {AccountBar} from "../../features/auth/ui/account-bar.tsx";
import {PlayerProvider} from "../../features/player/model/use-player-store.tsx";
import {AudioPlayer} from "../../features/player/ui/AudioPlayer.tsx";

export const RootLayout = () => (
    <PlayerProvider>
        <Header renderAccountBar={() => <AccountBar/>}/>
        <main className={s.page}>
            <Outlet/>
        </main>
        <AudioPlayer />
    </PlayerProvider>
)
