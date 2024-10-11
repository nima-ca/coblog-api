import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDTO) {
        return this.authService.register(dto);
    }

    @Post('login')
    login(@Body() dto: LoginDTO) {
        return this.authService.login(dto);
    }
}
