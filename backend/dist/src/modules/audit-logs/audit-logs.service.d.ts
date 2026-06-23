import { PrismaService } from '../../database/prisma.service';
import { AuditAction } from '@prisma/client';
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        userId?: string;
        action?: AuditAction;
        entity?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            action: import(".prisma/client").$Enums.AuditAction;
            entity: string;
            entityId: string | null;
            oldValue: import("@prisma/client/runtime/library").JsonValue | null;
            newValue: import("@prisma/client/runtime/library").JsonValue | null;
            ip: string | null;
            userAgent: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    log(data: {
        userId: string;
        action: AuditAction;
        entity: string;
        entityId?: string;
        oldValue?: any;
        newValue?: any;
        ip?: string;
        userAgent?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: import(".prisma/client").$Enums.AuditAction;
        entity: string;
        entityId: string | null;
        oldValue: import("@prisma/client/runtime/library").JsonValue | null;
        newValue: import("@prisma/client/runtime/library").JsonValue | null;
        ip: string | null;
        userAgent: string | null;
    }>;
    getStats(): Promise<{
        totalLogs: number;
        uniqueUsers: number;
        actions: {
            action: import(".prisma/client").$Enums.AuditAction;
            count: number;
        }[];
    }>;
}
