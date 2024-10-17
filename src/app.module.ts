import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import configurations from 'src/configs/config';
import { getDBCredentials } from 'src/configs/db/datasource';
import { TransactionMiddleware } from './common/middleware/transaction.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { JwtGuard } from './modules/auth/guards/jwt.guard';
import { RolesGuard } from './modules/auth/guards/role.guard';
import { GoogleStrategy } from './modules/auth/strategies/google.strategies';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
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
        ThrottlerModule.forRoot([{ ttl: seconds(1), limit: 10 }]),
        TypeOrmModule.forRoot({
            type: 'postgres',
            ...getDBCredentials(),
            synchronize: false,
            entities: ['dist/**/*.entity{.ts,.js}'],
        }),
        PostModule,
        CommentModule,
        CategoryModule,
        TagModule,
        ReactionModule,
        ReactionModule,
        AuthModule,
        UserModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        JwtStrategy,
        GoogleStrategy,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TransactionMiddleware).forRoutes('*');
    }
}
