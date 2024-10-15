import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../post/entities/post.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, Post])],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
