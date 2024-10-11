const configurations = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_DATABASE,

        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,

        port: parseInt(process.env.DB_PORT, 10) || 5432,
    },
});

export default configurations;
