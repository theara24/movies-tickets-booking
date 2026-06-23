import { PrismaService } from '../../database/prisma.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { CreateSeatDto } from './dto/create-seats.dto';
export declare class HallsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateHallDto): Promise<({
        seats: {
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
        }[];
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
    }) | null>;
    findAll(cinemaId?: string): Promise<({
        _count: {
            showtimes: number;
            seats: number;
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
    })[]>;
    findOne(id: string): Promise<{
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
        seats: {
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
        }[];
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
    }>;
    update(id: string, dto: UpdateHallDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        capacity: number;
        rows: number;
        columns: number;
        cinemaId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    bulkCreateSeats(seats: CreateSeatDto[]): Promise<{
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
}
