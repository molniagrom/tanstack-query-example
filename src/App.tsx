// import {useEffect} from 'react'
import {useQuery} from "@tanstack/react-query";
import {client} from "./shared/api/client.ts";
import {useEffect, useState} from "react";
// import {client} from "./shared/api/client.ts";

function App() {

    const [isVisible, setVisible] = useState(false);

    useEffect(() => {
        setInterval(() => {
            setVisible(prev => !prev);
        }, 10000)
    }, [])

    return (
        <>
            <h2>Hello, it-incubator</h2>
            {isVisible && <Playlists/>}
        </>
    )
}

const Playlists = () => {
    const query = useQuery({
        staleTime: 20000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        // gcTime: 5 * 1000,
        queryKey: ['playlists'],
        queryFn: () => client.GET("/playlists")
    })
    return (
        <div>
            {query.data?.data?.data.map((playlist) => (
                <li>{playlist.attributes.title}</li>
            ))}
        </div>
    )
}
export default App
