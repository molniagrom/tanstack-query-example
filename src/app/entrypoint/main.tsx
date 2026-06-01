import {createRoot} from 'react-dom/client'
import '../../index.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/reset.css'
import '../styles/index.css'
import {MutationCache, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {RouterProvider} from "@tanstack/react-router";
import {ToastContainer} from "react-toastify";
import {mutationGlobalErrorHandler} from "../../shared/api/query-error-handlers.ts";
import {routerInstance} from "../tanstack-router/router-instance.ts";
import {ThemeProvider} from "../../shared/lib/theme/theme-provider.tsx";

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

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <RouterProvider router={routerInstance}/>
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
        </ThemeProvider>
    </QueryClientProvider>,
)
