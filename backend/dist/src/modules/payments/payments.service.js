"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const generate_ref_1 = require("../../common/utils/generate-ref");
const qrcode = __importStar(require("qrcode"));
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async processPayment(userId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: {
                bookingSeats: { include: { seat: true } },
                showtime: { include: { movie: true, hall: true, cinema: true } },
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.userId !== userId) {
            throw new common_1.BadRequestException('This booking does not belong to you');
        }
        if (booking.status !== 'PENDING') {
            throw new common_1.BadRequestException(`Booking is already ${booking.status}`);
        }
        const existingPayment = await this.prisma.payment.findUnique({
            where: { bookingId: booking.id },
        });
        if (existingPayment && existingPayment.status === 'PAID') {
            throw new common_1.ConflictException('Booking already paid');
        }
        const paymentRef = (0, generate_ref_1.generatePaymentRef)();
        const result = await this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    bookingId: booking.id,
                    userId,
                    amount: booking.finalAmount,
                    paymentMethod: dto.paymentMethod,
                    paymentRef,
                    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                    status: 'PAID',
                    paidAt: new Date(),
                },
            });
            await tx.booking.update({
                where: { id: booking.id },
                data: { status: 'CONFIRMED', paidAt: new Date() },
            });
            const ticketRef = (0, generate_ref_1.generateTicketRef)();
            const qrData = JSON.stringify({
                ticketRef,
                bookingRef: booking.bookingRef,
                movie: booking.showtime.movie.title,
                hall: booking.showtime.hall.name,
                cinema: booking.showtime.cinema.name,
                startTime: booking.showtime.startTime,
                seats: booking.bookingSeats.map((bs) => `${bs.seat.row}${bs.seat.column}`),
            });
            const qrImage = await qrcode.toDataURL(qrData);
            const ticket = await tx.ticket.create({
                data: {
                    ticketRef,
                    bookingId: booking.id,
                    qrCode: qrImage,
                    qrData,
                    status: 'ACTIVE',
                    expiresAt: booking.showtime.startTime,
                },
            });
            await tx.notification.create({
                data: {
                    userId,
                    type: 'BOOKING_CONFIRMATION',
                    title: 'Booking Confirmed!',
                    message: `Your booking ${booking.bookingRef} for ${booking.showtime.movie.title} is confirmed.`,
                    data: { bookingId: booking.id, ticketRef: ticket.ticketRef },
                },
            });
            return { payment, ticket };
        });
        return result;
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.userId)
            where.userId = query.userId;
        const [data, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                include: {
                    booking: {
                        include: {
                            bookingSeats: { include: { seat: true } },
                            showtime: { include: { movie: { select: { title: true } } } },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.payment.count({ where }),
        ]);
        return {
            data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: {
                booking: {
                    include: {
                        bookingSeats: { include: { seat: true } },
                        showtime: { include: { movie: true, cinema: true, hall: true } },
                        user: { select: { fullName: true, email: true } },
                    },
                },
            },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return payment;
    }
    async findByBooking(bookingId) {
        const payment = await this.prisma.payment.findUnique({
            where: { bookingId },
            include: {
                booking: {
                    include: {
                        bookingSeats: { include: { seat: true } },
                        showtime: { include: { movie: true, cinema: true, hall: true } },
                    },
                },
            },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found for this booking');
        return payment;
    }
    async refundPayment(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { booking: true },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        if (payment.status !== 'PAID') {
            throw new common_1.BadRequestException('Payment cannot be refunded');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id },
                data: { status: 'REFUNDED' },
            });
            await tx.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'REFUNDED' },
            });
            await tx.ticket.updateMany({
                where: { bookingId: payment.bookingId },
                data: { status: 'REFUNDED' },
            });
        });
        return { message: 'Payment refunded successfully' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map