import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
    CorePaginatedResponse,
    CorePaginationQueryDto,
    CoreResponse,
    OrderDirection,
    PaginationMetaData,
} from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Category } from '../entities/category.entity';

export class FindAllCategoriesQueryDto extends CorePaginationQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(OrderDirection)
    order?: OrderDirection;
}

export class FindOneCategoryResponseDto extends Category {}

export const FindOneCategoryMapper = (
    category: Category,
): CoreResponse<FindOneCategoryResponseDto> => {
    return {
        data: category,
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};

export const FindAllCategoriesMapper = (
    result: [Category[], PaginationMetaData],
): CorePaginatedResponse<Category[]> => {
    return {
        data: result[0],
        metadata: result[1],
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
