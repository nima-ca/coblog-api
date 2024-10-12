import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { customAlphabet } from 'nanoid';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './dto/register.dto';
import { User, UserRole } from './entities/user.entity';
import { AccessTokenPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

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

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findOneByEmail(email);
        if (user && (await argon2.verify(user.password, password))) {
            return user;
        }

        return null;
    }

    async login(user: User): Promise<{ accessToken: string }> {
        user.lastLogin = new Date();
        this.userService.update(user);

        const payload: AccessTokenPayload = { sub: user.id, email: user.email };
        return { accessToken: this.jwtService.sign(payload) };
    }

    generateOTP() {
        const OTP_LENGTH = 6;
        const SEED = '0123456789';

        const randomNumGenerator = customAlphabet(SEED, OTP_LENGTH);
        return randomNumGenerator();
    }
}
