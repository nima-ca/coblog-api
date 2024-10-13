import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,

        private readonly categoryService: CategoryService,
    ) {}

    async create(
        createPostDto: CreatePostDto,
        user: User,
        queryRunner: QueryRunner,
    ): Promise<Post> {
        const tags = await Promise.all(
            createPostDto.tags.map(async (name) => {
                let tag = await queryRunner.manager.findOne(Tag, {
                    where: { name },
                });
                if (!tag) {
                    tag = queryRunner.manager.create(Tag, { name });
                    tag = await queryRunner.manager.save(Tag, tag);
                }
                return tag;
            }),
        );

        let categories: Category[];

        try {
            categories = await Promise.all(
                createPostDto.categories.map((categoryId) =>
                    this.categoryService.findOne(categoryId),
                ),
            );
        } catch (error) {
            throw new BadRequestException(
                'one of the companies does not exist',
            );
        }

        const post = queryRunner.manager.create(Post, {
            author: user,
            title: createPostDto.title,
            content: createPostDto.content,
            isPublished: createPostDto.isPublished,
            tags,
            categories,
        });

        const createdPost = await queryRunner.manager.save(Post, post);

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
