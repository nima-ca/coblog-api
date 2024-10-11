import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configurations from 'src/configs/config';
import { getDBCredentials } from 'src/configs/db/datasource';
import { CategoryModule } from './modules/category/category.module';
import { CommentModule } from './modules/comment/comment.module';
import { PostModule } from './modules/post/post.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { TagModule } from './modules/tag/tag.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configurations],
            envFilePath: './src/configs/envs/.development.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            ...getDBCredentials(),
            autoLoadEntities: true,
        }),
        UserModule,
        PostModule,
        CommentModule,
        CategoryModule,
        TagModule,
        ReactionModule,
        ReactionModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
