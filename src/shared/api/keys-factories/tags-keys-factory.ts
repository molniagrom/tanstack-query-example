export const tagsKeys = {
    all: ['tags'] as const,
    search: (search: string) => [...tagsKeys.all, 'search', search] as const,
}
