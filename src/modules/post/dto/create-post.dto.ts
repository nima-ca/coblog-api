import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

    @IsArray()
    @IsString({ each: true })
    tags: [];
}

export class CreatePostResponseDto extends PartialType(Post) {}
