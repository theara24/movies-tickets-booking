import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePromotionDto) {
    const existing = await this.prisma.promotion.findUnique({
      where: { code: dto.code },
    });
    if (existing) throw new ConflictException('Promotion code already exists');

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

  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: { _count: { select: { bookings: true } } },
    });
    if (!promotion) throw new NotFoundException('Promotion not found');
    return promotion;
  }

  async findByCode(code: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { code },
    });
    if (!promotion) throw new NotFoundException('Promotion not found');
    return promotion;
  }

  async validateCode(code: string, amount: number) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { code },
    });
    if (!promotion) throw new NotFoundException('Invalid promotion code');
    if (!promotion.isActive)
      throw new ConflictException('Promotion is inactive');
    if (new Date() < promotion.startsAt || new Date() > promotion.expiresAt) {
      throw new ConflictException('Promotion has expired');
    }
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
      throw new ConflictException('Promotion usage limit reached');
    }
    if (promotion.minAmount && amount < Number(promotion.minAmount)) {
      throw new ConflictException(
        `Minimum order amount of ${promotion.minAmount} required`,
      );
    }

    let discount = 0;
    if (promotion.type === 'PERCENTAGE') {
      discount = amount * (Number(promotion.value) / 100);
      if (promotion.maxDiscount)
        discount = Math.min(discount, Number(promotion.maxDiscount));
    } else if (promotion.type === 'FIXED') {
      discount = Number(promotion.value);
    }

    return { valid: true, promotion, discount };
  }

  async update(id: string, dto: UpdatePromotionDto) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promotion) throw new NotFoundException('Promotion not found');

    return this.prisma.promotion.update({
      where: { id },
      data: {
        ...dto,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  async remove(id: string) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promotion) throw new NotFoundException('Promotion not found');

    await this.prisma.promotion.delete({ where: { id } });
    return { message: 'Promotion deleted successfully' };
  }
}
