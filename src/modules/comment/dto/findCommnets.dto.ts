import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import {
    CorePaginatedResponse,
    CorePaginationQueryDto,
    OrderDirection,
    PaginationMetaData,
} from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Comment } from '../entities/comment.entity';

export class FindAllCommentsQueryDto extends CorePaginationQueryDto {
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10))
    postId: number;

    @IsOptional()
    @IsEnum(OrderDirection)
    order?: OrderDirection;
}

export const FindAllCommentsMapper = (
    result: [Comment[], PaginationMetaData],
): CorePaginatedResponse<Comment[]> => {
    return {
        data: result[0],
        metadata: result[1],
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
