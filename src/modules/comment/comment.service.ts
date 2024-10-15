import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { CreateCommentDto } from './dto/createComment.dto';
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
