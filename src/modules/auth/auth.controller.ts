import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/user.decorator';
import { LoginResponseDTO } from './dto/login.dto';
import { RegisterDTO, RegisterResponseDTO } from './dto/register.dto';
import { User } from './entities/user.entity';
import { LocalAuthGuard } from './guards/local.guard';

@Public()
@Controller('auth')
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
}
