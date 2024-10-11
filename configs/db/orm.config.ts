import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import configurations from 'configs/config';

export const getTypeORMConfig = (): TypeOrmModuleOptions => {
    const config = configurations();

    return {
        type: 'postgres',
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        username: config.database.user,
        password: config.database.password,

        entities: ['**/*.entity{.ts,.js}'],
        migrationsTableName: 'migration',
        migrations: ['src/migration/*.ts'],
    };
};
