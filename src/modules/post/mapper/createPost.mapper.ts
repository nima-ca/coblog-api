import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { CreatePostResponseDto } from '../dto/create-post.dto';
import { Post } from '../entities/post.entity';

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
