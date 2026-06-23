import { PromotionType } from '@prisma/client';
export declare class CreatePromotionDto {
    code: string;
    description?: string;
    type: PromotionType;
    value: number;
    minAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    isActive?: boolean;
    startsAt: string;
    expiresAt: string;
}
