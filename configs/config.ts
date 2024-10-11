import { config } from 'dotenv';

const envPath =
    process.env.NODE_ENV === 'development'
        ? 'configs/envs/.development.env'
        : 'configs/envs/.production.env';

const configs = config({
    path: envPath,
}).parsed;

const configurations = () => ({
    port: parseInt(configs.PORT, 10) || 3000,
    database: {
        host: configs.DB_HOST,
        name: configs.DB_DATABASE,

        user: configs.DB_USER,
        password: configs.DB_PASSWORD,

        port: parseInt(configs.DB_PORT, 10) || 5432,
    },
});

export default configurations;
