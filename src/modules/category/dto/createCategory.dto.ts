import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class CreateCategoryResponseDto extends PartialType(Category) {}

export const CreateCategoryMapper = (
    category: Category,
): CoreResponse<CreateCategoryResponseDto> => {
    return {
        data: category,
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
