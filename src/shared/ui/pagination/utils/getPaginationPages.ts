const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, index) => start + index)

export const getPaginationPages = (
    current: number,
    pagesCount: number,
    siblingCount: number,
): Array<number | '...'> => {
    const totalPageNumbers = siblingCount * 2 + 5

    if (pagesCount <= totalPageNumbers) {
        return range(1, pagesCount)
    }

    const leftSiblingIndex = Math.max(current - siblingCount, 1)
    const rightSiblingIndex = Math.min(current + siblingCount, pagesCount)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < pagesCount - 1

    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + siblingCount * 2
        return [...range(1, leftItemCount), '...', pagesCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + siblingCount * 2
        return [1, '...', ...range(pagesCount - rightItemCount + 1, pagesCount)]
    }

    return [1, '...', ...range(leftSiblingIndex, rightSiblingIndex), '...', pagesCount]
}
