import { AuditLogsService } from './audit-logs.service';
import { AuditAction } from '@prisma/client';
export declare class AuditLogsController {
    private auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(userId?: string, action?: AuditAction, entity?: string, startDate?: string, endDate?: string, page?: string, limit?: string): Promise<{
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
    getStats(): Promise<{
        totalLogs: number;
        uniqueUsers: number;
        actions: {
            action: import(".prisma/client").$Enums.AuditAction;
            count: number;
        }[];
    }>;
}
