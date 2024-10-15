import { IsNotEmpty, IsString } from 'class-validator';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Comment } from '../entities/comment.entity';

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;
}

export const UpdateCommentMapper = (
    comment: Comment,
): CoreResponse<Comment> => {
    return {
        data: comment,
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
