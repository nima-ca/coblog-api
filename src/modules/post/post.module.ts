import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { ReactionModule } from '../reaction/reaction.module';
import { Post } from './entities/post.entity';
import { PostController, PublicPostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post]), CategoryModule, ReactionModule],
    controllers: [PostController, PublicPostController],
    providers: [PostService],
})
export class PostModule {}
