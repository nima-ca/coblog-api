import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDirection, PaginationMetaData } from 'src/common/dto/core.dto';
import {
    generateORMPagination,
    generatePaginationMetaData,
} from 'src/common/utils/pagination';
import { Like, Repository } from 'typeorm';
import { FindAllTagsQueryDto } from './dto/findTag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    async findAndCreate(tagName: string) {
        const tag = await this.tagRepository.findOneBy({ name: tagName });

        if (tag) {
            return tag;
        }

        return await this.tagRepository.save(
            this.tagRepository.create({ name: tagName }),
        );
    }

    async findAll({
        page = 1,
        limit = 50,
        search = '',
        order = OrderDirection.DESC,
    }: FindAllTagsQueryDto): Promise<[Tag[], PaginationMetaData]> {
        const [tags, count] = await this.tagRepository.findAndCount({
            order: { createdAt: order },
            where: { name: Like(`%${search}%`) },
            ...generateORMPagination(page, limit),
        });

        return [tags, generatePaginationMetaData(page, limit, count)];
    }
}
