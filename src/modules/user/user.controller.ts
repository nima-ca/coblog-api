import { Controller, Get } from '@nestjs/common';
import { GetUser } from '../auth/decorators/user.decorator';
import { GetUserInfoMapper } from './dto/getUser.dto';
import { User } from './entities/user.entity';

@Controller({ path: 'user', version: '1' })
export class UserController {
    @Get()
    getUserInfo(@GetUser() user: User) {
        return GetUserInfoMapper(user);
    }
}
