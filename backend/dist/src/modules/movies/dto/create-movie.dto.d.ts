import { MovieStatus } from '@prisma/client';
export declare class CreateMovieDto {
    title: string;
    description: string;
    duration: number;
    language: string;
    rating: string;
    posterUrl?: string;
    trailerUrl?: string;
    releaseDate: string;
    endDate?: string;
    status?: MovieStatus;
    genreIds?: string[];
}
