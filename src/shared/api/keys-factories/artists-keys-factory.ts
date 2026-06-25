export const artistsKeys = {
    all: ['artists'] as const,
    search: (search: string) => [...artistsKeys.all, 'search', search] as const,
}
