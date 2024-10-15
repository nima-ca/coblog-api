import { PartialType } from '@nestjs/mapped-types';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Post } from '../entities/post.entity';

export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsArray()
    @IsNumber({}, { each: true })
    categories: number[];

    @IsBoolean()
    isPublished: boolean;

    @IsArray()
    @IsString({ each: true })
    tags: [];
}

export class CreatePostResponseDto extends PartialType(Post) {}

export const CreatePostMapper = (
    post: Post,
): CoreResponse<CreatePostResponseDto> => {
    return {
        data: {
            id: post.id,
            title: post.title,
            content: post.content,
        },
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
