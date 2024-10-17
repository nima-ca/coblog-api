import { config } from 'dotenv';

const envPath =
    process.env.NODE_ENV === 'development'
        ? '.development.env'
        : './dist/.production.env';

const configs = config({
    path: envPath,
}).parsed;

const configurations = () => ({
    port: parseInt(configs.PORT, 10) || 3000,
    frontEndDomain: configs.FRONT_END_DOMAIN,
    database: {
        host: configs.DB_HOST,
        name: configs.DB_DATABASE,

        user: configs.DB_USER,
        password: configs.DB_PASSWORD,

        port: parseInt(configs.DB_PORT, 10) || 5432,
    },

    auth: {
        jwt: {
            secretKey: configs.JWT_SECRET_KEY,
            expireIn: configs.JWT_EXPIRE,
        },

        google: {
            clientId: configs.GOOGLE_CLIENT_ID,
            clientSecret: configs.GOOGLE_CLIENT_SECRET,
            callbackUrl: configs.GOOGLE_CALLBACK_URL,
            frontEndRedirectPath: configs.GOOGLE_AUTH_REDIRECT_FRONT_END_PATH,
        },
    },
});

export default configurations;
