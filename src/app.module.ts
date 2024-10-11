import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configurations from 'configs/config';
import { getTypeORMConfig } from 'configs/db/orm.config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { LikeModule } from './like/like.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configurations],
            envFilePath: './configs/envs/.development.env',
        }),
        TypeOrmModule.forRoot(getTypeORMConfig()),
        UserModule,
        PostModule,
        CommentModule,
        CategoryModule,
        TagModule,
        LikeModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
