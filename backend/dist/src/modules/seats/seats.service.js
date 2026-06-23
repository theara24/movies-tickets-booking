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
exports.SeatsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let SeatsService = class SeatsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByHall(hallId) {
        return this.prisma.seat.findMany({
            where: { hallId },
            orderBy: [{ row: 'asc' }, { column: 'asc' }],
        });
    }
    async findOne(id) {
        const seat = await this.prisma.seat.findUnique({
            where: { id },
            include: { hall: { include: { cinema: true } } },
        });
        if (!seat)
            throw new common_1.NotFoundException('Seat not found');
        return seat;
    }
    async update(id, dto) {
        const seat = await this.prisma.seat.findUnique({ where: { id } });
        if (!seat)
            throw new common_1.NotFoundException('Seat not found');
        return this.prisma.seat.update({ where: { id }, data: dto });
    }
    async getAvailableSeats(showtimeId) {
        const showtime = await this.prisma.showtime.findUnique({
            where: { id: showtimeId },
            include: { hall: { include: { seats: true } } },
        });
        if (!showtime)
            throw new common_1.NotFoundException('Showtime not found');
        const bookedSeatIds = (await this.prisma.bookingSeat.findMany({
            where: {
                booking: { showtimeId, status: { in: ['PENDING', 'CONFIRMED'] } },
            },
            select: { seatId: true },
        })).map((bs) => bs.seatId);
        const lockedSeatIds = (await this.prisma.seatLock.findMany({
            where: {
                showtimeId,
                isActive: true,
                expiresAt: { gt: new Date() },
            },
            select: { seatId: true },
        })).map((sl) => sl.seatId);
        const unavailableIds = new Set([...bookedSeatIds, ...lockedSeatIds]);
        return showtime.hall.seats.map((seat) => ({
            ...seat,
            isAvailable: !unavailableIds.has(seat.id) && seat.isActive && seat.status === 'AVAILABLE',
        }));
    }
};
exports.SeatsService = SeatsService;
exports.SeatsService = SeatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeatsService);
//# sourceMappingURL=seats.service.js.map