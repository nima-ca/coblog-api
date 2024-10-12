import { Body, Controller, Post } from '@nestjs/common';
import { CoreResponse } from 'src/common/dto/core.dto';
import { OPERATION_SUCCESSFUL_MESSAGE } from 'src/common/messages/general.mesages';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO, RegisterResponseDTO } from './dto/register.dto';

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

    @Post('login')
    login(@Body() dto: LoginDTO) {
        return this.authService.login(dto);
    }
}
