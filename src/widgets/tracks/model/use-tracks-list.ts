import {useState} from "react";
import {useAllTracksQuery} from "../api/use-all-tracks-query.ts";
import type {SchemaGetTracksRequestPayload} from "../../../../shared/api/schema.ts";

type UseTracksListArgs = {
    userId?: string
}

export const useTracksList = ({userId}: UseTracksListArgs = {}) => {
    const [search, setSearch] = useState("")
    const [pageNumber, setPageNumber] = useState(1)
    const [sortBy, setSortBy] = useState<SchemaGetTracksRequestPayload['sortBy']>("publishedAt")
    const [sortDirection, setSortDirection] = useState<SchemaGetTracksRequestPayload['sortDirection']>("desc")

    const {
        data,
        isPending,
        isError,
        isFetching,
        error,
    } = useAllTracksQuery({
        pageNumber,
        pageSize: 20,
        search: search || undefined,
        sortBy,
        sortDirection,
        userId,
    })

    const tracks = data?.data ?? []
    const meta = data?.meta
    const pagesCount = meta?.pagesCount ?? 1

    return {
        search,
        setSearch,
        pageNumber,
        setPageNumber,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        tracks,
        isPending,
        isError,
        isFetching,
        error,
        pagesCount,
        totalCount: meta?.totalCount ?? 0,
    }
}
