import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
    CorePaginatedResponse,
    CorePaginationQueryDto,
    OrderDirection,
    PaginationMetaData,
} from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Tag } from '../entities/tag.entity';

export class FindAllTagsQueryDto extends CorePaginationQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(OrderDirection)
    order?: OrderDirection;
}

export const FindAllTagsMapper = (
    result: [Tag[], PaginationMetaData],
): CorePaginatedResponse<Tag[]> => {
    return {
        data: result[0],
        metadata: result[1],
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
