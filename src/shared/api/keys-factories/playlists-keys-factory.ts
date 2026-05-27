import type {SchemaGetPlaylistsRequestPayload} from "../schema.ts";

export const playlistsKeys = {
    all: ['playlists'] as const,
    lists: () => [...playlistsKeys.all, 'lists'] as const,
    myList: () => [...playlistsKeys.lists(), 'my'] as const,
    list: (filters: Partial<SchemaGetPlaylistsRequestPayload>) =>
        [...playlistsKeys.lists(), filters] as const,

    details: () => [...playlistsKeys.all, 'details'] as const,
    detail: (id: string) => [...playlistsKeys.details(), id] as const,
}