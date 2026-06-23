import { SeatType, SeatStatus } from '@prisma/client';
export declare class UpdateSeatDto {
    type?: SeatType;
    status?: SeatStatus;
    isActive?: boolean;
}
