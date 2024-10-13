import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { STRONG_PASSWORD_REGEX } from 'src/common/regex/regex';
import { User } from '../../user/entities/user.entity';

export class LoginDTO {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(128)
    @Matches(STRONG_PASSWORD_REGEX, {
        message:
            'password must contain at least a number and a special character',
    })
    password: string;
}

export class LoginResponseDTO {
    user: Pick<
        User,
        | 'id'
        | 'name'
        | 'email'
        | 'role'
        | 'isVerified'
        | 'lastLogin'
        | 'createdAt'
        | 'updatedAt'
    >;

    token: string;
}
