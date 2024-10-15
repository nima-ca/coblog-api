import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { GetQueryRunner } from 'src/common/decorators/transaction.decorator';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { QueryRunner } from 'typeorm';
import { Roles } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { User, UserRole } from '../user/entities/user.entity';
import {
    CreatePostDto,
    CreatePostMapper,
    CreatePostResponseDto,
} from './dto/createPost.dto';
import {
    FindAllPostsMapper,
    FindPostMapper,
    FindPostsQueryDto,
} from './dto/findPost.dto';
import {
    UpdatePostDto,
    UpdatePostMapper,
    UpdatePostResponseDto,
} from './dto/updatePost.dto';
import { Post as PostEntity } from './entities/post.entity';
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
    async findAll(@Query() query: FindPostsQueryDto) {
        const result = await this.postService.findAll(query);
        return FindAllPostsMapper(result);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CoreResponse<PostEntity>> {
        const result = await this.postService.findOne(+id);
        return FindPostMapper(result);
    }

    @Roles(UserRole.Admin)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @GetQueryRunner() qr: QueryRunner,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<CoreResponse<UpdatePostResponseDto>> {
        const result = await this.postService.update(+id, updatePostDto, qr);
        return UpdatePostMapper(result);
    }

    @Roles(UserRole.Admin)
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<CoreResponse> {
        await this.postService.remove(+id);
        return { message: OPERATION_SUCCESSFUL_MESSAGE };
    }
}
