import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { GetQueryRunner } from 'src/common/decorators/transaction.decorator';
import { CoreResponse } from 'src/common/dto/core.dto';
import { QueryRunner } from 'typeorm';
import { Roles } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { User, UserRole } from '../user/entities/user.entity';
import { CreatePostDto, CreatePostResponseDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostMapper } from './mapper/createPost.mapper';
import { PostService } from './post.service';

@Controller({ path: 'post', version: '1' })
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Roles(UserRole.Admin)
    @Post()
    async create(
        @Body() createPostDto: CreatePostDto,
        @GetUser() user: User,
        @GetQueryRunner() qr: QueryRunner,
    ): Promise<CoreResponse<CreatePostResponseDto>> {
        const result = await this.postService.create(createPostDto, user, qr);
        return CreatePostMapper(result);
    }

    @Get()
    findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postService.findOne(+id);
    }

    @Roles(UserRole.Admin)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.update(+id, updatePostDto);
    }

    @Roles(UserRole.Admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postService.remove(+id);
    }
}
