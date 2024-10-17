import { PartialType } from '@nestjs/mapped-types';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { User } from '../entities/user.entity';

export class GetUserInfoResponseDto extends PartialType(User) {}

export const GetUserInfoMapper = (
    user: User,
): CoreResponse<GetUserInfoResponseDto> => {
    return {
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        message: OPERATION_SUCCESSFUL_MESSAGE,
    };
};
