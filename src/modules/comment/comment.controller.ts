import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { CommentService } from './comment.service';
import { CreateCommentDto, CreateCommentMapper } from './dto/createComment.dto';
import { UpdateCommentDto, UpdateCommentMapper } from './dto/updateComment.dto';
import { Comment } from './entities/comment.entity';

@Controller({ path: 'comment', version: '1' })
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Post()
    async create(
        @Body() createCommentDto: CreateCommentDto,
        @GetUser() user: User,
    ): Promise<CoreResponse<Comment>> {
        const result = await this.commentService.create(createCommentDto, user);
        return CreateCommentMapper(result);
    }

    @Patch(':id')
    async update(
        @GetUser() user: User,
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
    ): Promise<CoreResponse<Comment>> {
        const result = await this.commentService.update(
            +id,
            updateCommentDto,
            user,
        );
        return UpdateCommentMapper(result);
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @GetUser() user: User,
    ): Promise<CoreResponse> {
        await this.commentService.remove(+id, user);
        return { message: OPERATION_SUCCESSFUL_MESSAGE };
    }
}
