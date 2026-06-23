import { PrismaService } from '../../database/prisma.service';
import { CreateCinemaDto } from './dto/create-cinema.dto';
import { UpdateCinemaDto } from './dto/update-cinema.dto';
export declare class CinemasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateCinemaDto): Promise<{
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
    }>;
    findAll(): Promise<({
        _count: {
            halls: number;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        staff: {
            id: string;
            user: {
                email: string;
                fullName: string;
            };
        }[];
        halls: ({
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
        })[];
    } & {
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
    }>;
    update(id: string, dto: UpdateCinemaDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
