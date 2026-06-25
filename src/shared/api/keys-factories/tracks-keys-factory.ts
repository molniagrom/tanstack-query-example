import type {SchemaGetTracksRequestPayload} from "../schema.ts";

export const tracksKeys = {
    all: ['tracks'] as const,
    lists: () => [...tracksKeys.all, 'lists'] as const,
    list: (filters: Partial<SchemaGetTracksRequestPayload>) =>
        [...tracksKeys.lists(), filters] as const,

    details: () => [...tracksKeys.all, 'details'] as const,
    detail: (id: string) => [...tracksKeys.details(), id] as const,

    playlistTracks: (playlistId: string) =>
        [...tracksKeys.all, 'playlistTracks', playlistId] as const,
}
