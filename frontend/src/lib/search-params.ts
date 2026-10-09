export function pageParam(value: string | undefined): number {
    const page = Number.parseInt(value ?? '1', 10);
    return Number.isFinite(page) && page > 0 ? page : 1;
}
