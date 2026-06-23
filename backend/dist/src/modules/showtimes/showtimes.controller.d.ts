import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
export declare class ShowtimesController {
    private showtimesService;
    constructor(showtimesService: ShowtimesService);
    create(dto: CreateShowtimeDto): Promise<{
        cinema: {
            name: string;
        };
        hall: {
            name: string;
        };
        movie: {
            title: string;
            duration: number;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        cinemaId: string;
        status: import(".prisma/client").$Enums.ShowtimeStatus;
        startTime: Date;
        endTime: Date;
        bufferMinutes: number;
        price: import("@prisma/client/runtime/library").Decimal;
        movieId: string;
        hallId: string;
    }>;
    findAll(movieId?: string, cinemaId?: string, date?: string, page?: string, limit?: string): Promise<{
        data: ({
            cinema: {
                id: string;
                name: string;
                city: string;
            };
            hall: {
                id: string;
                name: string;
                capacity: number;
            };
            movie: {
                id: string;
                title: string;
                duration: number;
                language: string;
                rating: string;
                posterUrl: string | null;
            };
            _count: {
                bookings: number;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            cinemaId: string;
            status: import(".prisma/client").$Enums.ShowtimeStatus;
            startTime: Date;
            endTime: Date;
            bufferMinutes: number;
            price: import("@prisma/client/runtime/library").Decimal;
            movieId: string;
            hallId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getByMovie(movieId: string, cinemaId?: string, date?: string): Promise<{
        data: ({
            cinema: {
                id: string;
                name: string;
                city: string;
            };
            hall: {
                id: string;
                name: string;
                capacity: number;
            };
            movie: {
                id: string;
                title: string;
                duration: number;
                language: string;
                rating: string;
                posterUrl: string | null;
            };
            _count: {
                bookings: number;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            cinemaId: string;
            status: import(".prisma/client").$Enums.ShowtimeStatus;
            startTime: Date;
            endTime: Date;
            bufferMinutes: number;
            price: import("@prisma/client/runtime/library").Decimal;
            movieId: string;
            hallId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getByDate(date: string, cinemaId?: string): Promise<{
        data: ({
            cinema: {
                id: string;
                name: string;
                city: string;
            };
            hall: {
                id: string;
                name: string;
                capacity: number;
            };
            movie: {
                id: string;
                title: string;
                duration: number;
                language: string;
                rating: string;
                posterUrl: string | null;
            };
            _count: {
                bookings: number;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            cinemaId: string;
            status: import(".prisma/client").$Enums.ShowtimeStatus;
            startTime: Date;
            endTime: Date;
            bufferMinutes: number;
            price: import("@prisma/client/runtime/library").Decimal;
            movieId: string;
            hallId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
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
        hall: {
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
        };
        movie: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            duration: number;
            language: string;
            rating: string;
            posterUrl: string | null;
            trailerUrl: string | null;
            releaseDate: Date;
            endDate: Date | null;
            status: import(".prisma/client").$Enums.MovieStatus;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        cinemaId: string;
        status: import(".prisma/client").$Enums.ShowtimeStatus;
        startTime: Date;
        endTime: Date;
        bufferMinutes: number;
        price: import("@prisma/client/runtime/library").Decimal;
        movieId: string;
        hallId: string;
    }>;
    update(id: string, dto: UpdateShowtimeDto): Promise<{
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
        hall: {
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
        movie: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            duration: number;
            language: string;
            rating: string;
            posterUrl: string | null;
            trailerUrl: string | null;
            releaseDate: Date;
            endDate: Date | null;
            status: import(".prisma/client").$Enums.MovieStatus;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        cinemaId: string;
        status: import(".prisma/client").$Enums.ShowtimeStatus;
        startTime: Date;
        endTime: Date;
        bufferMinutes: number;
        price: import("@prisma/client/runtime/library").Decimal;
        movieId: string;
        hallId: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
