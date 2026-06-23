import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(userId: string, page?: string, limit?: string): Promise<{
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
}
