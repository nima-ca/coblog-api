import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post]), CategoryModule],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
