"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AuditLogsService = class AuditLogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.userId)
            where.userId = query.userId;
        if (query.action)
            where.action = query.action;
        if (query.entity)
            where.entity = query.entity;
        if (query.startDate || query.endDate) {
            where.createdAt = {};
            if (query.startDate)
                where.createdAt.gte = new Date(query.startDate);
            if (query.endDate)
                where.createdAt.lte = new Date(query.endDate);
        }
        const [data, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, fullName: true, email: true } },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        return {
            data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async log(data) {
        return this.prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entity: data.entity,
                entityId: data.entityId,
                oldValue: data.oldValue || undefined,
                newValue: data.newValue || undefined,
                ip: data.ip,
                userAgent: data.userAgent,
            },
        });
    }
    async getStats() {
        const [totalLogs, uniqueUsers, actions] = await Promise.all([
            this.prisma.auditLog.count(),
            this.prisma.auditLog.groupBy({ by: ['userId'], _count: true }),
            this.prisma.auditLog.groupBy({ by: ['action'], _count: true }),
        ]);
        return {
            totalLogs,
            uniqueUsers: uniqueUsers.length,
            actions: actions.map((a) => ({ action: a.action, count: a._count })),
        };
    }
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map