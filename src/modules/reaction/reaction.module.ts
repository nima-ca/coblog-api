import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { Reaction } from './entities/reaction.entity';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';

@Module({
    imports: [TypeOrmModule.forFeature([Reaction, Post, Comment])],
    controllers: [ReactionController],
    providers: [ReactionService],
    exports: [ReactionService],
})
export class ReactionModule {}
