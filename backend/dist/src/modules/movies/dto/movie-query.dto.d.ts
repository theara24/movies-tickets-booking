import { MovieStatus } from '@prisma/client';
export declare class MovieQueryDto {
    search?: string;
    status?: MovieStatus;
    genreId?: string;
    language?: string;
}
