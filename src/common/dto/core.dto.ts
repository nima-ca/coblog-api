export class CoreResponse<T = void> {
    data: T | null;
    message?: string | undefined;
}

export class CorePaginatedResponse<T = void> extends CoreResponse<T> {
    metadata: {
        limit: number;
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}
