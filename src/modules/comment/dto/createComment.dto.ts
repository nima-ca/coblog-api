import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Comment } from '../entities/comment.entity';

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    @Min(1)
    postId: number;
}

export const CreateCommentMapper = (
    comment: Comment,
): CoreResponse<Comment> => {
    return {
        data: comment,
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
