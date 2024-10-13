import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    findAll() {
        return `This action returns all tag`;
    }
}
