import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';
export declare class MoviesController {
    private moviesService;
    constructor(moviesService: MoviesService);
    create(dto: CreateMovieDto): Promise<{
        genres: ({
            genre: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            };
        } & {
            genreId: string;
            movieId: string;
        })[];
    } & {
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
    }>;
    findAll(query: MovieQueryDto, page?: string, limit?: string): Promise<{
        data: ({
            genres: ({
                genre: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                };
            } & {
                genreId: string;
                movieId: string;
            })[];
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getNowShowing(page?: string, limit?: string): Promise<{
        data: ({
            genres: ({
                genre: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                };
            } & {
                genreId: string;
                movieId: string;
            })[];
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getComingSoon(page?: string, limit?: string): Promise<{
        data: ({
            genres: ({
                genre: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                };
            } & {
                genreId: string;
                movieId: string;
            })[];
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        showtimes: ({
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
        genres: ({
            genre: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            };
        } & {
            genreId: string;
            movieId: string;
        })[];
    } & {
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
    }>;
    update(id: string, dto: UpdateMovieDto): Promise<{
        genres: ({
            genre: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            };
        } & {
            genreId: string;
            movieId: string;
        })[];
    } & {
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
