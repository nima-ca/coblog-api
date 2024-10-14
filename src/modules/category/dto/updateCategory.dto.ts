import { PartialType } from '@nestjs/mapped-types';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './createCategory.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class UpdateCategoryResponseDto extends PartialType(Category) {}

export const UpdateCategoryMapper = (
    category: Category,
): CoreResponse<UpdateCategoryResponseDto> => {
    return {
        data: category,
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
