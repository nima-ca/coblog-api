import configurations from 'src/configs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const getDBCredentials = () => {
    const config = configurations();
    return {
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        username: config.database.user,
        password: config.database.password,
    };
};

export const getDataSourceOptions = (): DataSourceOptions => {
    return {
        type: 'postgres',
        ...getDBCredentials(),

        logging: true,
        entities: ['src/modules/**/*.entity.{js,ts}'],
        migrationsTableName: 'migration',
        migrations: ['src/migrations/*.ts'],
    };
};

export const AppDataSource = new DataSource(getDataSourceOptions());
