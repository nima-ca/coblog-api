import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import {
    CreateReactionMapper,
    CreateReactionResponseDto,
    ReactToCommentDto,
    ReactToPostDto,
} from './dto/createReaction.dto';
import { ReactionService } from './reaction.service';
@ApiBearerAuth()
@ApiTags(`reaction`)
@Controller({ path: 'reaction', version: '1' })
export class ReactionController {
    constructor(private readonly reactionService: ReactionService) {}

    @Post('post')
    async reactToPost(
        @Body() dto: ReactToPostDto,
        @GetUser() user: User,
    ): Promise<CoreResponse<CreateReactionResponseDto>> {
        const result = await this.reactionService.reactToPost(dto, user);
        return CreateReactionMapper(result);
    }

    @Post('comment')
    async reactToComment(
        @Body() dto: ReactToCommentDto,
        @GetUser() user: User,
    ): Promise<CoreResponse<CreateReactionResponseDto>> {
        const result = await this.reactionService.reactToComment(dto, user);
        return CreateReactionMapper(result);
    }

    @Delete('post/:id')
    async removePostReaction(
        @Param('id') id: number,
        @GetUser() user: User,
    ): Promise<CoreResponse> {
        await this.reactionService.removePostReaction(+id, user);
        return { message: OPERATION_SUCCESSFUL_MESSAGE };
    }

    @Delete('comment/:id')
    async removeCommentReaction(
        @Param('id') id: number,
        @GetUser() user: User,
    ): Promise<CoreResponse> {
        await this.reactionService.removeCommentReaction(+id, user);
        return { message: OPERATION_SUCCESSFUL_MESSAGE };
    }
}
