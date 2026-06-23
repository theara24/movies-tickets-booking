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
exports.FoodService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const generate_ref_1 = require("../../common/utils/generate-ref");
let FoodService = class FoodService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createItem(dto) {
        return this.prisma.foodItem.create({ data: dto });
    }
    async findAllItems(category) {
        const where = category ? { category: category } : {};
        return this.prisma.foodItem.findMany({
            where: { ...where, isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    async findOneItem(id) {
        const item = await this.prisma.foodItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Food item not found');
        return item;
    }
    async updateItem(id, dto) {
        const item = await this.prisma.foodItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Food item not found');
        return this.prisma.foodItem.update({ where: { id }, data: dto });
    }
    async removeItem(id) {
        const item = await this.prisma.foodItem.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException('Food item not found');
        await this.prisma.foodItem.update({
            where: { id },
            data: { isActive: false },
        });
        return { message: 'Food item deactivated' };
    }
    async createOrder(userId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: { foodOrder: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.userId !== userId)
            throw new common_1.BadRequestException('Not your booking');
        if (booking.foodOrder)
            throw new common_1.BadRequestException('Food order already exists for this booking');
        const foodItemIds = dto.items.map((i) => i.foodItemId);
        const foodItems = await this.prisma.foodItem.findMany({
            where: { id: { in: foodItemIds } },
        });
        if (foodItems.length !== foodItemIds.length) {
            throw new common_1.NotFoundException('Some food items not found');
        }
        for (const item of dto.items) {
            const foodItem = foodItems.find((f) => f.id === item.foodItemId);
            if (foodItem && foodItem.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${foodItem.name}`);
            }
        }
        const totalAmount = dto.items.reduce((sum, item) => {
            const foodItem = foodItems.find((f) => f.id === item.foodItemId);
            return sum + Number(foodItem.price) * item.quantity;
        }, 0);
        const orderRef = (0, generate_ref_1.generateOrderRef)();
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.foodOrder.create({
                data: {
                    orderRef,
                    bookingId: dto.bookingId,
                    customerId: (await this.prisma.customer.findUnique({ where: { userId } }))?.id,
                    totalAmount,
                    notes: dto.notes,
                    items: {
                        create: dto.items.map((item) => {
                            const foodItem = foodItems.find((f) => f.id === item.foodItemId);
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
    async findOrdersByBooking(bookingId) {
        const order = await this.prisma.foodOrder.findUnique({
            where: { bookingId },
            include: { items: { include: { foodItem: true } } },
        });
        if (!order)
            throw new common_1.NotFoundException('Food order not found');
        return order;
    }
    async findOrdersByUser(userId) {
        const customer = await this.prisma.customer.findUnique({
            where: { userId },
        });
        if (!customer)
            return [];
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
};
exports.FoodService = FoodService;
exports.FoodService = FoodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoodService);
//# sourceMappingURL=food.service.js.map