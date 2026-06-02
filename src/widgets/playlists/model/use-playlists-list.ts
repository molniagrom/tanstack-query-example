import { useState } from "react"
import { usePlaylistsQuery } from "../api/use-playlists-query.ts"

type UsePlaylistsListParams = {
    userId?: string
}

type UsePlaylistsListReturn = {
    search: string
    setSearch: (value: string) => void
    pageNumber: number
    setPageNumber: (page: number) => void
    playlists: Array<{
        id: string
        attributes: {
            title: string
            tags?: Array<unknown>
            user?: { name?: string }
            order: number
        }
    }>
    isPending: boolean
    isError: boolean
    isFetching: boolean
    error: Error | null
    pagesCount: number
    refetch: () => void
}

export const usePlaylistsList = ({ userId }: UsePlaylistsListParams): UsePlaylistsListReturn => {
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [search, setSearch] = useState<string>("")

    const query = usePlaylistsQuery(userId, { search, pageNumber })

    const playlists = query.data?.data ?? []
    const pagesCount = query.data?.meta?.pagesCount ?? 1

    return {
        search,
        setSearch,
        pageNumber,
        setPageNumber,
        playlists,
        isPending: query.isPending,
        isError: query.isError,
        isFetching: query.isFetching,
        error: query.error,
        pagesCount,
        refetch: () => void query.refetch(),
    }
}
