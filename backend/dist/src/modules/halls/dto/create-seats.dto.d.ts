import { SeatType } from '@prisma/client';
export declare class CreateSeatDto {
    hallId: string;
    row: string;
    column: string;
    number: number;
    type: SeatType;
}
