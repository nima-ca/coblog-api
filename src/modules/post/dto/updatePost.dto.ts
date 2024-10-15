import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './createPost.dto';

export class UpdatePostDto extends CreatePostDto {}

export class UpdatePostResponseDto extends Post {}

export const UpdatePostMapper = (
    post: Post,
): CoreResponse<UpdatePostResponseDto> => {
    return {
        data: post,
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
