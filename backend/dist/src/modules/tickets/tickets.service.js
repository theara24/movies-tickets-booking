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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let TicketsService = class TicketsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUser(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.ticket.findMany({
                where: { booking: { userId } },
                skip,
                take: limit,
                include: {
                    booking: {
                        include: {
                            bookingSeats: { include: { seat: true } },
                            showtime: {
                                include: { movie: { select: { title: true, posterUrl: true, duration: true } }, cinema: true, hall: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.ticket.count({ where: { booking: { userId } } }),
        ]);
        return {
            data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findByReference(ticketRef) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { ticketRef },
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
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return ticket;
    }
    async findOne(id) {
        const ticket = await this.prisma.ticket.findUnique({
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
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return ticket;
    }
    async validateTicket(ticketRef) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { ticketRef },
            include: {
                booking: {
                    include: {
                        bookingSeats: { include: { seat: true } },
                        showtime: { include: { movie: true, cinema: true, hall: true } },
                    },
                },
            },
        });
        if (!ticket) {
            throw new common_1.NotFoundException('Ticket not found');
        }
        if (ticket.status === client_1.TicketStatus.USED) {
            throw new common_1.BadRequestException('Ticket has already been used');
        }
        if (ticket.status === client_1.TicketStatus.EXPIRED) {
            throw new common_1.BadRequestException('Ticket has expired');
        }
        if (ticket.status === client_1.TicketStatus.REFUNDED) {
            throw new common_1.BadRequestException('Ticket has been refunded');
        }
        if (new Date() > ticket.expiresAt) {
            await this.prisma.ticket.update({
                where: { id: ticket.id },
                data: { status: client_1.TicketStatus.EXPIRED },
            });
            throw new common_1.BadRequestException('Ticket has expired');
        }
        return {
            valid: true,
            ticket,
            message: 'Ticket is valid',
        };
    }
    async scanTicket(ticketRef, scannedBy) {
        const validation = await this.validateTicket(ticketRef);
        const ticket = await this.prisma.ticket.update({
            where: { id: validation.ticket.id },
            data: {
                status: client_1.TicketStatus.USED,
                usedAt: new Date(),
                scannedBy,
            },
        });
        return { message: 'Ticket scanned successfully', ticket };
    }
    async getTicketByBooking(bookingId) {
        const ticket = await this.prisma.ticket.findUnique({
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
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found for this booking');
        return ticket;
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map