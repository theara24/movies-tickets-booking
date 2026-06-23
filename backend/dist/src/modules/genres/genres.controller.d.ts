import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
export declare class GenresController {
    private genresService;
    constructor(genresService: GenresService);
    create(dto: CreateGenreDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    findAll(): Promise<({
        _count: {
            movies: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    })[]>;
    findOne(id: string): Promise<{
        movies: ({
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
            genreId: string;
            movieId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    update(id: string, dto: UpdateGenreDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
