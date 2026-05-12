import {createRoot} from 'react-dom/client'
import '../../index.css'
import '../styles/reset.css'
import '../styles/index.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {createRouter, RouterProvider} from "@tanstack/react-router";
import { routeTree } from "../routes/routeTree.gen"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            gcTime: 5 * 60 * 1000,
        }
    }
})

const router = createRouter({routeTree})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>,
)
