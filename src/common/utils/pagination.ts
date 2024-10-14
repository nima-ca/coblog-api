import { PaginationMetaData } from '../dto/core.dto';

export const generateORMPagination = (page: number, limit: number) => {
    return {
        skip: limit * (page - 1),
        take: limit,
    };
};

export const generatePaginationMetaData = (
    page: number,
    limit: number,
    count: number,
): PaginationMetaData => {
    return {
        limit: limit,
        currentPage: page,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
    };
};
