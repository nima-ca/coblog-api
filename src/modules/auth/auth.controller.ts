import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/user.decorator';
import { LoginResponseDTO } from './dto/login.dto';
import { RegisterDTO, RegisterResponseDTO } from './dto/register.dto';
import { GoogleOAuthGuard } from './guards/google.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { GoogleUserProfileInfo } from './interfaces/google.interface';

@Public()
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(
        @Body() dto: RegisterDTO,
    ): Promise<CoreResponse<RegisterResponseDTO>> {
        await this.authService.register(dto);
        return {
            data: null,
            message: OPERATION_SUCCESSFUL_MESSAGE,
        };
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @GetUser() user: User,
    ): Promise<CoreResponse<LoginResponseDTO>> {
        const result = await this.authService.login(user);

        return {
            message: OPERATION_SUCCESSFUL_MESSAGE,
            data: {
                token: result.accessToken,
                user: {
                    id: user.id,
                    role: user.role,
                    name: user.name,
                    email: user.email,
                    lastLogin: new Date(),
                    isVerified: user.isVerified,

                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        };
    }

    @Get('google')
    @UseGuards(GoogleOAuthGuard)
    async googleAuth(@Request() req) {}

    @Get('google-redirect')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirect(
        @Res() res: Response,
        @GetUser() user: GoogleUserProfileInfo,
    ) {
        const { redirectUrl } = await this.authService.googleLogin(user);
        return res.redirect(redirectUrl);
    }
}
