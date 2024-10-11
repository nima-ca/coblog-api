import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { STRONG_PASSWORD_REGEX } from 'src/common/regex/regex';

export class RegisterDTO {
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

export class RegisterResponseDTO {}
