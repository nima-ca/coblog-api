import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../post/entities/post.entity';
import { ReactionModule } from '../reaction/reaction.module';
import {
    CommentController,
    PublicCommentController,
} from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Post]), ReactionModule],
    controllers: [CommentController, PublicCommentController],
    providers: [CommentService],
})
export class CommentModule {}
