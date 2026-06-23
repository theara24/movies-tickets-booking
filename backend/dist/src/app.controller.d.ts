export declare class AppController {
    getHealth(): {
        success: boolean;
        message: string;
        data: {
            version: string;
            timestamp: string;
        };
    };
}
