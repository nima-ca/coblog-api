import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDirection, PaginationMetaData } from 'src/common/dto/core.dto';
import { PGError } from 'src/common/errors/postgers.errors';
import {
    generateORMPagination,
    generatePaginationMetaData,
} from 'src/common/utils/pagination';
import { Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { FindAllCategoriesQueryDto } from './dto/findCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
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

    async findAll({
        page = 1,
        limit = 10,
        search = '',
        order = OrderDirection.DESC,
    }: FindAllCategoriesQueryDto): Promise<[Category[], PaginationMetaData]> {
        const [categories, categoriesCount] =
            await this.categoryRepository.findAndCount({
                ...generateORMPagination(page, limit),
                where: {
                    name: Like(`%${search}%`),
                },
                order: { createdAt: order },
            });

        return [
            categories,
            generatePaginationMetaData(page, limit, categoriesCount),
        ];
    }

    async findOne(id: number): Promise<Category | null> {
        const category = await this.categoryRepository.findOneBy({ id });

        if (!category) {
            throw new NotFoundException();
        }

        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        try {
            const updatedCategory = await this.categoryRepository.save({
                id,
                name: updateCategoryDto.name,
            });

            return updatedCategory;
        } catch (error) {
            if (error?.code === PGError.DUPLICATE_CONSTRAINT) {
                throw new BadRequestException(
                    'category with same name does exist',
                );
            }

            throw error;
        }
    }

    async remove(id: number) {
        const result = await this.categoryRepository.delete({ id });

        if (result.affected === 0) {
            throw new BadRequestException('category not found');
        }
    }
}
