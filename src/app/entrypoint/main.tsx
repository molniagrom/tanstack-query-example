import {createRoot} from 'react-dom/client'
import '../../index.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/reset.css'
import '../styles/index.css'
import {MutationCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {createRouter, RouterProvider} from "@tanstack/react-router";
import { routeTree } from "../routes/routeTree.gen"
import {ToastContainer} from "react-toastify";
import {mutationGlobalErrorHandler} from "../../shared/api/query-error-handlers.ts";

const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onError: mutationGlobalErrorHandler,
    }),
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
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
        <ToastContainer
            position="top-right"
            autoClose={4500}
            hideProgressBar
            closeOnClick
            pauseOnFocusLoss
            pauseOnHover
            theme="light"
            toastClassName="musketeerToast"
        />
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>,
)
