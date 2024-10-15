import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDirection, PaginationMetaData } from 'src/common/dto/core.dto';
import { countByKey } from 'src/common/utils/count';
import {
    generateORMPagination,
    generatePaginationMetaData,
} from 'src/common/utils/pagination';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { ReactionType } from '../reaction/entities/reaction.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { FindAllCommentsQueryDto } from './dto/findCommnets.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,

        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
    ) {}

    async create(
        createCommentDto: CreateCommentDto,
        user: User,
    ): Promise<Comment> {
        const post = await this.postsRepository.findOneBy({
            id: createCommentDto.postId,
        });

        if (!post) {
            throw new BadRequestException('post not found');
        }

        const comment = await this.commentsRepository.save({
            post,
            user,
            content: createCommentDto.content,
        });

        return comment;
    }

    async findAll({
        postId,
        page = 1,
        limit = 10,
        order = OrderDirection.DESC,
    }: FindAllCommentsQueryDto): Promise<[Comment[], PaginationMetaData]> {
        const [comments, count] = await this.commentsRepository.findAndCount({
            select: {
                id: true,
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
            where: {
                post: { id: postId },
            },
            relations: {
                user: true,
                reactions: { user: true },
            },
            order: { createdAt: order },
            ...generateORMPagination(page, limit),
        });

        // TODO: Check if user is reacted

        const commentsWithReactionCount = comments.map((comment) => ({
            ...comment,
            reactions: undefined,
            reactionCounts: {
                [ReactionType.LIKE]: countByKey(
                    comment.reactions,
                    'type',
                    ReactionType.LIKE,
                ),
                [ReactionType.ANGRY]: countByKey(
                    comment.reactions,
                    'type',
                    ReactionType.ANGRY,
                ),
                [ReactionType.DISLIKE]: countByKey(
                    comment.reactions,
                    'type',
                    ReactionType.DISLIKE,
                ),
                [ReactionType.LOVE]: countByKey(
                    comment.reactions,
                    'type',
                    ReactionType.LOVE,
                ),
                [ReactionType.SAD]: countByKey(
                    comment.reactions,
                    'type',
                    ReactionType.SAD,
                ),
                [ReactionType.THINK]: countByKey(
                    comment.reactions,
                    'type',
                    ReactionType.THINK,
                ),
                [ReactionType.WOW]: countByKey(
                    comment.reactions,
                    'type',
                    ReactionType.WOW,
                ),
            },
        }));

        return [
            commentsWithReactionCount,
            generatePaginationMetaData(page, limit, count),
        ];
    }

    async update(id: number, updateCommentDto: UpdateCommentDto, user: User) {
        const comment = await this.commentsRepository.findOne({
            where: { id },
            relations: {
                user: true,
            },
        });

        if (!comment) {
            throw new BadRequestException('comment not found');
        }

        if (comment.user.id !== user.id) {
            throw new ForbiddenException(
                "you do not have access to other's comment",
            );
        }

        comment.content = updateCommentDto.content;
        this.commentsRepository.save(comment);

        return comment;
    }

    async remove(id: number, user: User) {
        const comment = await this.commentsRepository.findOne({
            where: { id },
            relations: {
                user: true,
            },
        });

        if (!comment) {
            throw new BadRequestException('comment not found');
        }

        if (comment.user.id !== user.id && user.role !== UserRole.Admin) {
            throw new ForbiddenException(
                "you do not have access to other's comment",
            );
        }

        await this.commentsRepository.delete({ id: comment.id });
    }
}
