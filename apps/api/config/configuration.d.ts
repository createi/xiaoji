declare const _default: () => {
    port: number;
    env: string;
    database: {
        url: string | undefined;
    };
    redis: {
        url: string | undefined;
    };
    jwt: {
        secret: string | undefined;
        expiresIn: string;
    };
    storage: {
        driver: string;
        localPath: string;
        oss: {
            bucket: string | undefined;
            cdn: string | undefined;
        };
    };
    swagger: {
        enabled: boolean;
    };
    rateLimit: {
        enabled: boolean;
        ttl: number;
        limit: number;
    };
    cache: {
        enabled: boolean;
    };
};
export default _default;
//# sourceMappingURL=configuration.d.ts.map