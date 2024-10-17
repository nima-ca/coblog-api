import { IsEnum, IsInt, Min } from 'class-validator';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Reaction, ReactionType } from '../entities/reaction.entity';

export class ReactToPostDto {
    @IsInt()
    @Min(1)
    postId: number;

    @IsEnum(ReactionType)
    type: ReactionType;
}

export class ReactToCommentDto {
    @IsInt()
    @Min(1)
    commentId: number;

    @IsEnum(ReactionType)
    type: ReactionType;
}

export class CreateReactionResponseDto {
    id: number;
    type: ReactionType;
}

export const CreateReactionMapper = (
    reaction: Reaction,
): CoreResponse<CreateReactionResponseDto> => {
    return {
        data: { id: reaction.id, type: reaction.type },
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
