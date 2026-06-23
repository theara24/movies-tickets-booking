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
exports.SeatLockService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../database/prisma.service");
const seat_lock_gateway_1 = require("./seat-lock.gateway");
let SeatLockService = class SeatLockService {
    prisma;
    seatLockGateway;
    constructor(prisma, seatLockGateway) {
        this.prisma = prisma;
        this.seatLockGateway = seatLockGateway;
    }
    async lockSeat(userId, showtimeId, seatId, durationMs = 600000) {
        const expiresAt = new Date(Date.now() + durationMs);
        const existingLock = await this.prisma.seatLock.findFirst({
            where: {
                seatId,
                showtimeId,
                isActive: true,
                expiresAt: { gt: new Date() },
            },
        });
        if (existingLock && existingLock.userId !== userId) {
            return {
                locked: false,
                message: 'Seat is already locked by another user',
            };
        }
        await this.prisma.seatLock.upsert({
            where: {
                id: existingLock?.id || 'nonexistent',
            },
            create: {
                seatId,
                showtimeId,
                userId,
                expiresAt,
            },
            update: {
                isActive: true,
                expiresAt,
                userId,
            },
        });
        this.seatLockGateway.broadcastSeatLocked(showtimeId, [seatId]);
        return { locked: true, expiresAt };
    }
    async lockMultipleSeats(userId, showtimeId, seatIds, durationMs = 600000) {
        const results = [];
        for (const seatId of seatIds) {
            const result = await this.lockSeat(userId, showtimeId, seatId, durationMs);
            results.push({ seatId, ...result });
        }
        return results;
    }
    async releaseSeat(userId, showtimeId, seatId) {
        await this.prisma.seatLock.updateMany({
            where: {
                seatId,
                showtimeId,
                userId,
                isActive: true,
            },
            data: { isActive: false },
        });
        this.seatLockGateway.broadcastSeatReleased(showtimeId, [seatId]);
        return { released: true };
    }
    async releaseMultipleSeats(userId, showtimeId, seatIds) {
        await this.prisma.seatLock.updateMany({
            where: {
                seatId: { in: seatIds },
                showtimeId,
                userId,
                isActive: true,
            },
            data: { isActive: false },
        });
        this.seatLockGateway.broadcastSeatReleased(showtimeId, seatIds);
        return { released: true };
    }
    async getActiveLocks(showtimeId) {
        return this.prisma.seatLock.findMany({
            where: {
                showtimeId,
                isActive: true,
                expiresAt: { gt: new Date() },
            },
            include: { seat: true },
        });
    }
    async cleanupExpiredLocks() {
        const expired = await this.prisma.seatLock.findMany({
            where: {
                isActive: true,
                expiresAt: { lte: new Date() },
            },
        });
        if (expired.length === 0)
            return;
        const showtimeSeats = new Map();
        for (const lock of expired) {
            const seats = showtimeSeats.get(lock.showtimeId) || [];
            seats.push(lock.seatId);
            showtimeSeats.set(lock.showtimeId, seats);
        }
        await this.prisma.seatLock.updateMany({
            where: {
                id: { in: expired.map((l) => l.id) },
            },
            data: { isActive: false },
        });
        for (const [showtimeId, seatIds] of showtimeSeats) {
            this.seatLockGateway.broadcastSeatReleased(showtimeId, seatIds);
        }
    }
};
exports.SeatLockService = SeatLockService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SeatLockService.prototype, "cleanupExpiredLocks", null);
exports.SeatLockService = SeatLockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        seat_lock_gateway_1.SeatLockGateway])
], SeatLockService);
//# sourceMappingURL=seat-lock.service.js.map