import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PGError } from 'src/common/errors/postgers.errors';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(user: User) {
        try {
            const result = await this.usersRepository.insert(user);

            console.log(result);
        } catch (error) {
            if (error?.code === PGError.DUPLICATE_CONSTRAINT) {
                throw new BadRequestException('email is already in use');
            }

            throw error;
        }
    }

    async update(user: User) {
        await this.usersRepository.update({ id: user.id }, user);
    }

    async findOneByEmail(email: string): Promise<User | null> {
        const user = await this.usersRepository.findOneBy({ email });
        return user;
    }

    async findOneById(id: number): Promise<User | null> {
        const user = await this.usersRepository.findOneBy({ id });
        return user;
    }
}
