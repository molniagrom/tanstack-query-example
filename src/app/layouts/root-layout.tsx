import {Outlet} from "@tanstack/react-router";
import {Header} from "../../shared/ui/header/header.tsx";
import s from "./root-layout.module.css"
import {AccountBar} from "../../features/auth/ui/account-bar.tsx";

export const RootLayout = () => (
    <>
        <Header renderAccountBar={() => <AccountBar/>}/>
        <main className={s.page}>
            <Outlet/>
        </main>
    </>
)
