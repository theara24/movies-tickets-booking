import { PrismaService } from '../../database/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByUser(userId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            title: string;
            type: import(".prisma/client").$Enums.NotificationType;
            message: string;
            isRead: boolean;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<{
        unreadCount: number;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    delete(id: string, userId: string): Promise<{
        message: string;
    }>;
    create(data: {
        userId: string;
        type: string;
        title: string;
        message: string;
        data?: any;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        title: string;
        type: import(".prisma/client").$Enums.NotificationType;
        message: string;
        isRead: boolean;
    }>;
}
