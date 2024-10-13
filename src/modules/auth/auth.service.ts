import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { customAlphabet } from 'nanoid';
import { User, UserRole } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './dto/register.dto';
import { GoogleUserProfileInfo } from './interfaces/google.interface';
import { AccessTokenPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
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

    async googleLogin(
        userInfo: GoogleUserProfileInfo,
    ): Promise<{ redirectUrl: string }> {
        if (!userInfo) {
            const redirectUrl = this.generateGoogleRedirectURL(false, null);
            return { redirectUrl };
        }

        let currentUser = await this.userService.findOneByEmail(userInfo.email);

        if (currentUser) {
            currentUser.lastLogin = new Date();
            this.userService.update(currentUser);
        }

        if (!currentUser) {
            const newUser = new User();

            newUser.email = userInfo.email;
            newUser.profilePicture = userInfo.picture;
            newUser.name = `${userInfo.firstName} ${userInfo.lastName}`;

            newUser.password = '';
            newUser.isVerified = true;
            newUser.role = UserRole.User;
            newUser.lastLogin = new Date();

            await this.userService.create(newUser);

            currentUser = newUser;
        }

        const payload: AccessTokenPayload = {
            sub: currentUser.id,
            email: currentUser.email,
        };
        const token = this.jwtService.sign(payload);

        const redirectUrl = this.generateGoogleRedirectURL(true, token);
        return { redirectUrl };
    }

    generateGoogleRedirectURL(status: boolean, token: string | null) {
        const frontEndDomain = this.configService.get<string>('frontEndDomain');
        const frontEndRedirectPath = this.configService.get<string>(
            'auth.google.frontEndRedirectPath',
        );

        const redirectUrl = frontEndDomain + frontEndRedirectPath;
        return redirectUrl + `?success=${status}&token=${token}`;
    }

    generateOTP() {
        const OTP_LENGTH = 6;
        const SEED = '0123456789';

        const randomNumGenerator = customAlphabet(SEED, OTP_LENGTH);
        return randomNumGenerator();
    }
}
