import configurations from 'configs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const getDataSourceOptions = (): DataSourceOptions => {
    const config = configurations();

    return {
        type: 'postgres',
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        username: config.database.user,
        password: config.database.password,

        logging: true,
        synchronize: false,
        entities: ['src/modules/**/*.entity.ts'],
        migrationsTableName: 'migration',
        migrations: ['src/migrations/*.ts'],
    };
};

export const AppDataSource = new DataSource(getDataSourceOptions());
