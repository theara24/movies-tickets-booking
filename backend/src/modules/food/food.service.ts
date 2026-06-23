import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { CreateFoodOrderDto } from './dto/create-food-order.dto';
import { generateOrderRef } from '../../common/utils/generate-ref';

@Injectable()
export class FoodService {
  constructor(private prisma: PrismaService) {}

  async createItem(dto: CreateFoodItemDto) {
    return this.prisma.foodItem.create({ data: dto });
  }

  async findAllItems(category?: string) {
    const where = category ? { category: category as any } : {};
    return this.prisma.foodItem.findMany({
      where: { ...where, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOneItem(id: string) {
    const item = await this.prisma.foodItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Food item not found');
    return item;
  }

  async updateItem(id: string, dto: UpdateFoodItemDto) {
    const item = await this.prisma.foodItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Food item not found');
    return this.prisma.foodItem.update({ where: { id }, data: dto });
  }

  async removeItem(id: string) {
    const item = await this.prisma.foodItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Food item not found');
    await this.prisma.foodItem.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: 'Food item deactivated' };
  }

  async createOrder(userId: string, dto: CreateFoodOrderDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: { foodOrder: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId)
      throw new BadRequestException('Not your booking');
    if (booking.foodOrder)
      throw new BadRequestException(
        'Food order already exists for this booking',
      );

    const foodItemIds = dto.items.map((i) => i.foodItemId);
    const foodItems = await this.prisma.foodItem.findMany({
      where: { id: { in: foodItemIds } },
    });

    if (foodItems.length !== foodItemIds.length) {
      throw new NotFoundException('Some food items not found');
    }

    for (const item of dto.items) {
      const foodItem = foodItems.find((f) => f.id === item.foodItemId);
      if (foodItem && foodItem.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${foodItem.name}`,
        );
      }
    }

    const totalAmount = dto.items.reduce((sum, item) => {
      const foodItem = foodItems.find((f) => f.id === item.foodItemId);
      return sum + Number(foodItem!.price) * item.quantity;
    }, 0);

    const orderRef = generateOrderRef();

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.foodOrder.create({
        data: {
          orderRef,
          bookingId: dto.bookingId,
          customerId: (
            await this.prisma.customer.findUnique({ where: { userId } })
          )?.id,
          totalAmount,
          notes: dto.notes,
          items: {
            create: dto.items.map((item) => {
              const foodItem = foodItems.find((f) => f.id === item.foodItemId)!;
              return {
                foodItemId: item.foodItemId,
                quantity: item.quantity,
                unitPrice: foodItem.price,
              };
            }),
          },
        },
        include: { items: { include: { foodItem: true } } },
      });

      for (const item of dto.items) {
        await tx.foodItem.update({
          where: { id: item.foodItemId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return order;
  }

  async findOrdersByBooking(bookingId: string) {
    const order = await this.prisma.foodOrder.findUnique({
      where: { bookingId },
      include: { items: { include: { foodItem: true } } },
    });
    if (!order) throw new NotFoundException('Food order not found');
    return order;
  }

  async findOrdersByUser(userId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) return [];

    return this.prisma.foodOrder.findMany({
      where: { customerId: customer.id },
      include: {
        items: { include: { foodItem: true } },
        booking: { select: { bookingRef: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllOrders(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.foodOrder.findMany({
        skip,
        take: limit,
        include: {
          items: { include: { foodItem: true } },
          booking: { select: { bookingRef: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.foodOrder.count(),
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
