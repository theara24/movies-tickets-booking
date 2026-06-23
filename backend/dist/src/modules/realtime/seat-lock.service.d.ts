import { PrismaService } from '../../database/prisma.service';
import { SeatLockGateway } from './seat-lock.gateway';
export declare class SeatLockService {
    private prisma;
    private seatLockGateway;
    constructor(prisma: PrismaService, seatLockGateway: SeatLockGateway);
    lockSeat(userId: string, showtimeId: string, seatId: string, durationMs?: number): Promise<{
        locked: boolean;
        message: string;
        expiresAt?: undefined;
    } | {
        locked: boolean;
        expiresAt: Date;
        message?: undefined;
    }>;
    lockMultipleSeats(userId: string, showtimeId: string, seatIds: string[], durationMs?: number): Promise<{
        seatId: string;
        locked: boolean;
        message?: string;
        expiresAt?: Date;
    }[]>;
    releaseSeat(userId: string, showtimeId: string, seatId: string): Promise<{
        released: boolean;
    }>;
    releaseMultipleSeats(userId: string, showtimeId: string, seatIds: string[]): Promise<{
        released: boolean;
    }>;
    getActiveLocks(showtimeId: string): Promise<({
        seat: {
            number: number;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.SeatStatus;
            hallId: string;
            type: import(".prisma/client").$Enums.SeatType;
            row: string;
            column: string;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        seatId: string;
        showtimeId: string;
    })[]>;
    cleanupExpiredLocks(): Promise<void>;
}
