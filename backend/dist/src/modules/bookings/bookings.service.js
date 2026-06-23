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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const generate_ref_1 = require("../../common/utils/generate-ref");
const seat_lock_gateway_1 = require("../realtime/seat-lock.gateway");
const client_1 = require("@prisma/client");
let BookingsService = class BookingsService {
    prisma;
    seatLockGateway;
    constructor(prisma, seatLockGateway) {
        this.prisma = prisma;
        this.seatLockGateway = seatLockGateway;
    }
    async create(userId, dto) {
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: dto.showtimeId },
            include: { movie: true, hall: true },
        });
        if (!showtime)
            throw new common_1.NotFoundException('Showtime not found');
        if (showtime.status === 'CANCELLED' || showtime.status === 'FINISHED') {
            throw new common_1.BadRequestException('Showtime is no longer available');
        }
        if (new Date() > showtime.startTime) {
            throw new common_1.BadRequestException('Showtime has already started');
        }
        if (!dto.seatIds || dto.seatIds.length === 0) {
            throw new common_1.BadRequestException('At least one seat must be selected');
        }
        const seats = await this.prisma.seat.findMany({
            where: { id: { in: dto.seatIds }, hallId: showtime.hallId },
        });
        if (seats.length !== dto.seatIds.length) {
            throw new common_1.BadRequestException('Some seats not found in this hall');
        }
        const bookedSeatIds = (await this.prisma.bookingSeat.findMany({
            where: {
                booking: {
                    showtimeId: dto.showtimeId,
                    status: { in: ['PENDING', 'CONFIRMED'] },
                },
                seatId: { in: dto.seatIds },
            },
        })).map((bs) => bs.seatId);
        if (bookedSeatIds.length > 0) {
            throw new common_1.ConflictException(`Seats ${bookedSeatIds.join(', ')} are already booked`);
        }
        const lockedSeats = await this.prisma.seatLock.findMany({
            where: {
                showtimeId: dto.showtimeId,
                seatId: { in: dto.seatIds },
                isActive: true,
                expiresAt: { gt: new Date() },
                userId: { not: userId },
            },
        });
        if (lockedSeats.length > 0) {
            throw new common_1.ConflictException('Some seats are locked by another user');
        }
        const baseAmount = seats.length * Number(showtime.price);
        let discountAmount = 0;
        if (dto.promotionCode) {
            const promotion = await this.prisma.promotion.findUnique({
                where: { code: dto.promotionCode },
            });
            if (!promotion || !promotion.isActive) {
                throw new common_1.BadRequestException('Invalid promotion code');
            }
            if (new Date() < promotion.startsAt || new Date() > promotion.expiresAt) {
                throw new common_1.BadRequestException('Promotion has expired');
            }
            if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
                throw new common_1.BadRequestException('Promotion usage limit reached');
            }
            if (promotion.minAmount && baseAmount < Number(promotion.minAmount)) {
                throw new common_1.BadRequestException(`Minimum amount ${promotion.minAmount} not met`);
            }
            if (promotion.type === 'PERCENTAGE') {
                discountAmount = baseAmount * (Number(promotion.value) / 100);
                if (promotion.maxDiscount) {
                    discountAmount = Math.min(discountAmount, Number(promotion.maxDiscount));
                }
            }
            else if (promotion.type === 'FIXED') {
                discountAmount = Number(promotion.value);
            }
            await this.prisma.promotion.update({
                where: { id: promotion.id },
                data: { usedCount: { increment: 1 } },
            });
        }
        const finalAmount = Math.max(0, baseAmount - discountAmount);
        const bookingRef = (0, generate_ref_1.generateBookingRef)();
        const booking = await this.prisma.$transaction(async (tx) => {
            const newBooking = await tx.booking.create({
                data: {
                    bookingRef,
                    userId,
                    showtimeId: dto.showtimeId,
                    totalAmount: baseAmount,
                    discountAmount,
                    finalAmount,
                    status: 'PENDING',
                    bookingSeats: {
                        create: seats.map((seat) => ({
                            seatId: seat.id,
                            price: showtime.price,
                        })),
                    },
                },
                include: {
                    bookingSeats: { include: { seat: true } },
                    showtime: {
                        include: { movie: true, hall: true, cinema: true },
                    },
                },
            });
            await tx.seatLock.deleteMany({
                where: {
                    showtimeId: dto.showtimeId,
                    seatId: { in: dto.seatIds },
                    userId,
                },
            });
            return newBooking;
        });
        this.seatLockGateway.broadcastSeatLocked(dto.showtimeId, dto.seatIds);
        this.seatLockGateway.broadcastBookingUpdate(booking);
        return booking;
    }
    async findAll(query, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {};
        if (query.userId)
            where.userId = query.userId;
        if (query.showtimeId)
            where.showtimeId = query.showtimeId;
        if (query.status)
            where.status = query.status;
        const [data, total] = await Promise.all([
            this.prisma.booking.findMany({
                where,
                skip,
                take: limit,
                include: {
                    bookingSeats: { include: { seat: true } },
                    showtime: {
                        include: { movie: { select: { title: true, posterUrl: true, duration: true } }, cinema: true, hall: true },
                    },
                    payment: true,
                    ticket: true,
                    promotion: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.booking.count({ where }),
        ]);
        return {
            data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                bookingSeats: { include: { seat: true } },
                showtime: {
                    include: { movie: true, cinema: true, hall: true },
                },
                payment: true,
                ticket: true,
                promotion: true,
                user: { select: { id: true, fullName: true, email: true, phone: true } },
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    async findByUser(userId, page = 1, limit = 10) {
        return this.findAll({ userId }, page, limit);
    }
    async findByReference(ref) {
        const booking = await this.prisma.booking.findUnique({
            where: { bookingRef: ref },
            include: {
                bookingSeats: { include: { seat: true } },
                showtime: { include: { movie: true, cinema: true, hall: true } },
                payment: true,
                ticket: true,
                promotion: true,
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
    async cancelBooking(id, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { payment: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.userId !== userId) {
            throw new common_1.BadRequestException('You can only cancel your own bookings');
        }
        if (booking.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        if (booking.status === 'REFUNDED') {
            throw new common_1.BadRequestException('Booking has already been refunded');
        }
        if (booking.showtimeId && new Date() > (await this.prisma.showtime.findUnique({ where: { id: booking.showtimeId } }))?.startTime) {
            throw new common_1.BadRequestException('Cannot cancel past showtime');
        }
        const updateData = { status: 'CANCELLED', cancelledAt: new Date() };
        if (booking.payment && booking.payment.status === 'PAID') {
            updateData.status = 'REFUNDED';
        }
        const updated = await this.prisma.booking.update({
            where: { id },
            data: updateData,
        });
        if (booking.payment && booking.payment.status === 'PAID') {
            await this.prisma.payment.update({
                where: { id: booking.payment.id },
                data: { status: 'REFUNDED' },
            });
        }
        const seatIds = (await this.prisma.bookingSeat.findMany({ where: { bookingId: id }, select: { seatId: true } })).map(bs => bs.seatId);
        this.seatLockGateway.broadcastSeatReleased(booking.showtimeId, seatIds);
        await this.prisma.auditLog.create({
            data: {
                userId,
                action: booking.payment?.status === 'PAID' ? client_1.AuditAction.REFUND : client_1.AuditAction.UPDATE,
                entity: 'Booking',
                entityId: id,
                oldValue: { status: booking.status },
                newValue: { status: updateData.status },
            },
        });
        return updated;
    }
    async getBookingSummary(userId) {
        const [totalBookings, activeBookings, cancelledBookings, totalSpent] = await Promise.all([
            this.prisma.booking.count({ where: { userId } }),
            this.prisma.booking.count({ where: { userId, status: 'CONFIRMED' } }),
            this.prisma.booking.count({ where: { userId, status: 'CANCELLED' } }),
            this.prisma.booking.aggregate({
                where: { userId, status: 'CONFIRMED' },
                _sum: { finalAmount: true },
            }),
        ]);
        return {
            totalBookings,
            activeBookings,
            cancelledBookings,
            totalSpent: totalSpent._sum.finalAmount || 0,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        seat_lock_gateway_1.SeatLockGateway])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map