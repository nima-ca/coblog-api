import { PartialType } from '@nestjs/mapped-types';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
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
