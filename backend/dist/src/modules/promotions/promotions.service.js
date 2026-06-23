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
exports.PromotionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let PromotionsService = class PromotionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.promotion.findUnique({
            where: { code: dto.code },
        });
        if (existing)
            throw new common_1.ConflictException('Promotion code already exists');
        return this.prisma.promotion.create({
            data: {
                ...dto,
                startsAt: new Date(dto.startsAt),
                expiresAt: new Date(dto.expiresAt),
            },
        });
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.promotion.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.promotion.count(),
        ]);
        return {
            data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { id },
            include: { _count: { select: { bookings: true } } },
        });
        if (!promotion)
            throw new common_1.NotFoundException('Promotion not found');
        return promotion;
    }
    async findByCode(code) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { code },
        });
        if (!promotion)
            throw new common_1.NotFoundException('Promotion not found');
        return promotion;
    }
    async validateCode(code, amount) {
        const promotion = await this.prisma.promotion.findUnique({
            where: { code },
        });
        if (!promotion)
            throw new common_1.NotFoundException('Invalid promotion code');
        if (!promotion.isActive)
            throw new common_1.ConflictException('Promotion is inactive');
        if (new Date() < promotion.startsAt || new Date() > promotion.expiresAt) {
            throw new common_1.ConflictException('Promotion has expired');
        }
        if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
            throw new common_1.ConflictException('Promotion usage limit reached');
        }
        if (promotion.minAmount && amount < Number(promotion.minAmount)) {
            throw new common_1.ConflictException(`Minimum order amount of ${promotion.minAmount} required`);
        }
        let discount = 0;
        if (promotion.type === 'PERCENTAGE') {
            discount = amount * (Number(promotion.value) / 100);
            if (promotion.maxDiscount)
                discount = Math.min(discount, Number(promotion.maxDiscount));
        }
        else if (promotion.type === 'FIXED') {
            discount = Number(promotion.value);
        }
        return { valid: true, promotion, discount };
    }
    async update(id, dto) {
        const promotion = await this.prisma.promotion.findUnique({ where: { id } });
        if (!promotion)
            throw new common_1.NotFoundException('Promotion not found');
        return this.prisma.promotion.update({
            where: { id },
            data: {
                ...dto,
                startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
            },
        });
    }
    async remove(id) {
        const promotion = await this.prisma.promotion.findUnique({ where: { id } });
        if (!promotion)
            throw new common_1.NotFoundException('Promotion not found');
        await this.prisma.promotion.delete({ where: { id } });
        return { message: 'Promotion deleted successfully' };
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map