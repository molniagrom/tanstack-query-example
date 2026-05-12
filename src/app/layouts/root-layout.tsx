import {Outlet} from "@tanstack/react-router";
import {Header} from "../../shared/ui/header/header.tsx";
import s from "./root-layout.module.css"

export const RootLayout = () => (
    <>
        <Header renderAccountBar={() => <div>Account</div>}/>
        <main className={s.page}>
            <Outlet/>
        </main>
    </>
)
