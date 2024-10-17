import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDirection, PaginationMetaData } from 'src/common/dto/core.dto';
import {
    generateORMPagination,
    generatePaginationMetaData,
} from 'src/common/utils/pagination';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { ReactionService } from '../reaction/reaction.service';
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

        private readonly reactionService: ReactionService,
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

    async findAll(
        {
            postId,
            page = 1,
            limit = 10,
            order = OrderDirection.DESC,
        }: FindAllCommentsQueryDto,
        user?: User,
    ): Promise<[Comment[], PaginationMetaData]> {
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

        const commentsWithReactionCount = comments.map((comment) => {
            const userReaction = comment.reactions.find(
                (reaction) => reaction.user.id === user?.id,
            );

            return {
                ...comment,
                reactions: undefined,
                userReaction: userReaction?.type ?? null,
                reactionCounts: this.reactionService.countReactions(
                    comment.reactions,
                ),
            };
        });

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
