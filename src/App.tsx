import {useEffect} from 'react'

import './App.css'
import {client} from "./shared/api/client.ts";

function App() {

    useEffect(() => {
        (async function () {
            const res = await client.GET("/playlists")
            const data = res.data
            console.log(data)
        })()
    }, []);

    return (
        <>
            Hello, it-incubator
        </>
    )
}

export default App
