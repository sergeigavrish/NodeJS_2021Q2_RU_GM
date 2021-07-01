export declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN_SECRET: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_NAME: string;
            DB_HOST: string
            DB_PORT: number;
            DB_DIALECT: Dialect
        }
    }
}