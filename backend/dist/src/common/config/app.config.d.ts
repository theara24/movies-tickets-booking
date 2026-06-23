declare const _default: () => {
    port: number;
    nodeEnv: string;
    frontendUrl: string;
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
    throttle: {
        ttl: number;
        limit: number;
    };
    seatLock: {
        durationMs: number;
    };
};
export default _default;
