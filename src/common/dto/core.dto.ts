import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}
export class CoreResponse<T = void> {
    data?: T | null;
    message?: string | undefined;
}

export class CorePaginationQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10))
    page?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10))
    limit?: number;
}

export class CoreSearchQueryDto {
    @IsOptional()
    @IsString()
    search?: string;
}

export class CoreOrderDirectionQueryDto {
    @IsOptional()
    @IsEnum(OrderDirection)
    orderDirection?: OrderDirection;
}

export class PaginationMetaData {
    limit: number;
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export class CorePaginatedResponse<T = void> extends CoreResponse<T> {
    metadata: PaginationMetaData;
}
