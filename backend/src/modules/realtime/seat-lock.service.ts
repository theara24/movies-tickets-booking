import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma.service';
import { SeatLockGateway } from './seat-lock.gateway';

@Injectable()
export class SeatLockService {
  constructor(
    private prisma: PrismaService,
    private seatLockGateway: SeatLockGateway,
  ) {}

  async lockSeat(
    userId: string,
    showtimeId: string,
    seatId: string,
    durationMs = 600000,
  ) {
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
      return { locked: false, message: 'Seat is already locked by another user' };
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

  async lockMultipleSeats(
    userId: string,
    showtimeId: string,
    seatIds: string[],
    durationMs = 600000,
  ) {
    const results: Array<{ seatId: string; locked: boolean; message?: string; expiresAt?: Date }> = [];
    for (const seatId of seatIds) {
      const result = await this.lockSeat(userId, showtimeId, seatId, durationMs);
      results.push({ seatId, ...result });
    }

    return results;
  }

  async releaseSeat(userId: string, showtimeId: string, seatId: string) {
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

  async releaseMultipleSeats(userId: string, showtimeId: string, seatIds: string[]) {
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

  async getActiveLocks(showtimeId: string) {
    return this.prisma.seatLock.findMany({
      where: {
        showtimeId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: { seat: true },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async cleanupExpiredLocks() {
    const expired = await this.prisma.seatLock.findMany({
      where: {
        isActive: true,
        expiresAt: { lte: new Date() },
      },
    });

    if (expired.length === 0) return;

    const showtimeSeats = new Map<string, string[]>();
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
}
