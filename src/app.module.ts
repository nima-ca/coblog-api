import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configurations from 'configs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeORMConfig } from 'configs/db/orm.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configurations],
            envFilePath: './configs/envs/.development.env',
        }),
        TypeOrmModule.forRoot(getTypeORMConfig()),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
