import { BookingStatus } from '@prisma/client';
export declare class BookingQueryDto {
    userId?: string;
    showtimeId?: string;
    status?: BookingStatus;
}
