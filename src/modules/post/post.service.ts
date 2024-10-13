import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagService } from '../tag/tag.service';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
    constructor(
        private readonly tagService: TagService,

        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
        const tags = await Promise.all(
            createPostDto.tags.map((tag) => this.tagService.findAndCreate(tag)),
        );

        // TODO: add category

        const post = this.postRepository.create({
            author: user,
            title: createPostDto.title,
            content: createPostDto.content,
            tags,
        });

        const createdPost = await this.postRepository.save(post);

        return createdPost;
    }

    findAll() {
        return `This action returns all post`;
    }

    findOne(id: number) {
        return `This action returns a #${id} post`;
    }

    update(id: number, updatePostDto: UpdatePostDto) {
        return `This action updates a #${id} post`;
    }

    remove(id: number) {
        return `This action removes a #${id} post`;
    }
}
