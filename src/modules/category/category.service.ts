import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PGError } from 'src/common/errors/postgers.errors';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async create(
        createCategoryDto: CreateCategoryDto,
    ): Promise<Category | null> {
        try {
            const category = this.categoryRepository.create({
                name: createCategoryDto.name,
            });

            await this.categoryRepository.insert(category);
            return category;
        } catch (error) {
            if (error?.code === PGError.DUPLICATE_CONSTRAINT) {
                throw new BadRequestException(
                    'category with same name does exist',
                );
            }

            throw error;
        }
    }

    findAll() {
        return `This action returns all category`;
    }

    async findOne(id: number): Promise<Category | null> {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new NotFoundException();
        }

        return category;
    }

    update(id: number, updateCategoryDto: UpdateCategoryDto) {
        return `This action updates a #${id} category`;
    }

    remove(id: number) {
        return `This action removes a #${id} category`;
    }
}
