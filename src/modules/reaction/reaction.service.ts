import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { countByKey } from 'src/common/utils/count';
import { Repository } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { ReactToCommentDto, ReactToPostDto } from './dto/createReaction.dto';
import { Reaction, ReactionType } from './entities/reaction.entity';

@Injectable()
export class ReactionService {
    constructor(
        @InjectRepository(Reaction)
        private readonly reactionRepository: Repository<Reaction>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    async reactToPost(dto: ReactToPostDto, user: User) {
        const doesPostExist = await this.postRepository.findOneBy({
            id: dto.postId,
        });

        if (!doesPostExist) {
            throw new BadRequestException('post does not exists');
        }

        const reaction = await this.reactionRepository.findOneBy({
            user: { id: user.id },
            post: { id: dto.postId },
        });

        if (reaction) {
            if (reaction.type === dto.type) {
                return reaction;
            }

            reaction.type = dto.type;
            await this.reactionRepository.save(reaction);

            return reaction;
        }

        const createdReaction = await this.reactionRepository.save({
            type: dto.type,
            user: { id: user.id },
            post: { id: dto.postId },
        });

        return createdReaction;
    }

    async reactToComment(dto: ReactToCommentDto, user: User) {
        const doesCommentExist = await this.commentRepository.findOneBy({
            id: dto.commentId,
        });

        if (!doesCommentExist) {
            throw new BadRequestException('comment does not exists');
        }

        const reaction = await this.reactionRepository.findOneBy({
            user: { id: user.id },
            comment: { id: dto.commentId },
        });

        if (reaction) {
            if (reaction.type === dto.type) {
                return reaction;
            }

            reaction.type = dto.type;
            await this.reactionRepository.save(reaction);

            return reaction;
        }

        const createdReaction = await this.reactionRepository.save({
            type: dto.type,
            user: { id: user.id },
            comment: { id: dto.commentId },
        });

        return createdReaction;
    }

    async removePostReaction(postId: number, user: User) {
        const doesPostExist = await this.postRepository.findOneBy({
            id: postId,
        });

        if (!doesPostExist) {
            throw new BadRequestException('post does not exists');
        }

        const reaction = await this.reactionRepository.findOneBy({
            user: { id: user.id },
            post: { id: postId },
        });

        if (!reaction) {
            throw new BadRequestException('no reaction is found for the post');
        }

        await this.reactionRepository.delete({ id: reaction.id });
    }

    async removeCommentReaction(commentId: number, user: User) {
        const doesCommentExists = await this.commentRepository.findOneBy({
            id: commentId,
        });

        if (!doesCommentExists) {
            throw new BadRequestException('post does not exists');
        }

        const reaction = await this.reactionRepository.findOneBy({
            user: { id: user.id },
            comment: { id: commentId },
        });

        if (!reaction) {
            throw new BadRequestException(
                'no reaction is found for the comment',
            );
        }

        await this.reactionRepository.delete({ id: reaction.id });
    }

    countReactions(reactions: Reaction[]) {
        return {
            [ReactionType.LIKE]: countByKey(
                reactions,
                'type',
                ReactionType.LIKE,
            ),
            [ReactionType.ANGRY]: countByKey(
                reactions,
                'type',
                ReactionType.ANGRY,
            ),
            [ReactionType.DISLIKE]: countByKey(
                reactions,
                'type',
                ReactionType.DISLIKE,
            ),
            [ReactionType.LOVE]: countByKey(
                reactions,
                'type',
                ReactionType.LOVE,
            ),
            [ReactionType.SAD]: countByKey(reactions, 'type', ReactionType.SAD),
            [ReactionType.THINK]: countByKey(
                reactions,
                'type',
                ReactionType.THINK,
            ),
            [ReactionType.WOW]: countByKey(reactions, 'type', ReactionType.WOW),
        };
    }
}
