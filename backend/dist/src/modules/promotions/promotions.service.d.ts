import { PrismaService } from '../../database/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
export declare class PromotionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePromotionDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        type: import(".prisma/client").$Enums.PromotionType;
        value: import("@prisma/client/runtime/library").Decimal;
        minAmount: import("@prisma/client/runtime/library").Decimal | null;
        maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
        usageLimit: number | null;
        usedCount: number;
        startsAt: Date;
        expiresAt: Date;
    }>;
    findAll(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            type: import(".prisma/client").$Enums.PromotionType;
            value: import("@prisma/client/runtime/library").Decimal;
            minAmount: import("@prisma/client/runtime/library").Decimal | null;
            maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
            usageLimit: number | null;
            usedCount: number;
            startsAt: Date;
            expiresAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        _count: {
            bookings: number;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        type: import(".prisma/client").$Enums.PromotionType;
        value: import("@prisma/client/runtime/library").Decimal;
        minAmount: import("@prisma/client/runtime/library").Decimal | null;
        maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
        usageLimit: number | null;
        usedCount: number;
        startsAt: Date;
        expiresAt: Date;
    }>;
    findByCode(code: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        type: import(".prisma/client").$Enums.PromotionType;
        value: import("@prisma/client/runtime/library").Decimal;
        minAmount: import("@prisma/client/runtime/library").Decimal | null;
        maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
        usageLimit: number | null;
        usedCount: number;
        startsAt: Date;
        expiresAt: Date;
    }>;
    validateCode(code: string, amount: number): Promise<{
        valid: boolean;
        promotion: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            type: import(".prisma/client").$Enums.PromotionType;
            value: import("@prisma/client/runtime/library").Decimal;
            minAmount: import("@prisma/client/runtime/library").Decimal | null;
            maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
            usageLimit: number | null;
            usedCount: number;
            startsAt: Date;
            expiresAt: Date;
        };
        discount: number;
    }>;
    update(id: string, dto: UpdatePromotionDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        type: import(".prisma/client").$Enums.PromotionType;
        value: import("@prisma/client/runtime/library").Decimal;
        minAmount: import("@prisma/client/runtime/library").Decimal | null;
        maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
        usageLimit: number | null;
        usedCount: number;
        startsAt: Date;
        expiresAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
