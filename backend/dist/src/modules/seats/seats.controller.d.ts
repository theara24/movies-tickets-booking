import { SeatsService } from './seats.service';
import { UpdateSeatDto } from './dto/update-seat.dto';
export declare class SeatsController {
    private seatsService;
    constructor(seatsService: SeatsService);
    findByHall(hallId: string): Promise<{
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
    }[]>;
    getAvailableSeats(showtimeId: string): Promise<{
        isAvailable: boolean;
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
    }[]>;
    findOne(id: string): Promise<{
        hall: {
            cinema: {
                id: string;
                email: string | null;
                phone: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                address: string;
                city: string;
                imageUrl: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            capacity: number;
            rows: number;
            columns: number;
            cinemaId: string;
        };
    } & {
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
    }>;
    update(id: string, dto: UpdateSeatDto): Promise<{
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
    }>;
}
