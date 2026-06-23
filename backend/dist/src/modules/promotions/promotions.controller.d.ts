import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
export declare class PromotionsController {
    private promotionsService;
    constructor(promotionsService: PromotionsService);
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
    validateCode(code: string, amount: string): Promise<{
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
    findAll(page?: string, limit?: string): Promise<{
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
