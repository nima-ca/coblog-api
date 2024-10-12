import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { customAlphabet } from 'nanoid';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async register(dto: RegisterDTO): Promise<User> {
        const user = new User();

        user.name = dto.name;
        user.email = dto.email;
        user.role = UserRole.User;

        user.password = await argon2.hash(dto.password);

        const otp = this.generateOTP();
        user.otp = otp;
        user.otpSendTime = new Date();

        await this.userService.create(user);

        // TODO: send otp to user email

        return user;
    }

    async login(dto: LoginDTO) {}

    generateOTP() {
        const OTP_LENGTH = 6;
        const SEED = '0123456789';

        const randomNumGenerator = customAlphabet(SEED, OTP_LENGTH);
        return randomNumGenerator();
    }
}
