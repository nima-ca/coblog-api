import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import {
    CorePaginatedResponse,
    CorePaginationQueryDto,
    CoreResponse,
    OrderDirection,
    PaginationMetaData,
} from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Post } from '../entities/post.entity';

export class FindPostsQueryDto extends CorePaginationQueryDto {
    @IsOptional()
    @IsString()
    search: string;

    @IsOptional()
    @IsEnum(OrderDirection)
    order: OrderDirection;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10))
    categoryId: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10))
    tagId: number;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    isPublished: boolean;
}

export const FindAllPostsMapper = (
    result: [Post[], PaginationMetaData],
): CorePaginatedResponse<Post[]> => {
    return {
        data: result[0],
        metadata: result[1],
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};

export const FindPostMapper = (result: Post): CoreResponse<Post> => {
    return {
        data: result,
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
