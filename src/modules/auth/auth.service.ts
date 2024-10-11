import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async register(dto: RegisterDTO) {}

    async login(dto: LoginDTO) {}
}
