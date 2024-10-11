import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configurations from 'configs/config';
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
    controllers: [],
    providers: [],
})
export class AppModule {}
