import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDirection, PaginationMetaData } from 'src/common/dto/core.dto';
import {
    generateORMPagination,
    generatePaginationMetaData,
} from 'src/common/utils/pagination';
import { Like, QueryRunner, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { ReactionService } from '../reaction/reaction.service';
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { FindPostsQueryDto } from './dto/findPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        private readonly categoryService: CategoryService,
        private readonly reactionService: ReactionService,
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
                'one of the categories does not exist',
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

    async findAll({
        tagId,
        page = 1,
        limit = 10,
        categoryId,
        search = '',
        isPublished = true,
        order = OrderDirection.DESC,
    }: FindPostsQueryDto): Promise<[Post[], PaginationMetaData]> {
        const [posts, count] = await this.postRepository.findAndCount({
            relations: {
                tags: true,
                author: true,
                categories: true,
            },
            where: {
                isPublished,
                tags: { id: tagId },
                title: Like(`%${search}%`),
                categories: { id: categoryId },
            },
            order: { createdAt: order },
            ...generateORMPagination(page, limit),
        });

        return [posts, generatePaginationMetaData(page, limit, count)];
    }

    async findOne(id: number, user?: User) {
        const post = await this.postRepository.findOne({
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                updatedAt: true,

                reactions: {
                    id: true,
                    type: true,
                    user: {
                        id: true,
                    },
                },
            },
            where: { id },
            relations: {
                tags: true,
                author: true,
                categories: true,
                reactions: {
                    user: true,
                },
            },
        });

        const userReaction = post.reactions.find(
            (reaction) => reaction.user.id === user?.id,
        );

        const postWithCountedReactions = {
            ...post,
            reactions: undefined,
            userReaction: userReaction?.type ?? null,
            reactionCounts: this.reactionService.countReactions(post.reactions),
        };

        if (!post) {
            throw new BadRequestException('post not found');
        }

        return postWithCountedReactions;
    }

    async update(
        id: number,
        updatePostDto: UpdatePostDto,
        queryRunner: QueryRunner,
    ) {
        const post = await this.postRepository.findOneBy({ id });

        if (!post) {
            throw new BadRequestException('post not found');
        }

        const tags = await Promise.all(
            updatePostDto.tags.map(async (name) => {
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
                updatePostDto.categories.map((categoryId) =>
                    this.categoryService.findOne(categoryId),
                ),
            );
        } catch (error) {
            throw new BadRequestException(
                'one of the categories does not exist',
            );
        }

        const updatedPost = await queryRunner.manager.save(Post, {
            id,
            title: updatePostDto.title,
            content: updatePostDto.content,
            isPublished: updatePostDto.isPublished,
            tags,
            categories,
        });

        return updatedPost;
    }

    async remove(id: number) {
        const result = await this.postRepository.delete({ id });

        if (result.affected === 0) {
            throw new BadRequestException('post not found');
        }
    }
}
