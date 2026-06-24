import { MovieStatus } from '@prisma/client';
export declare class MovieQueryDto {
    search?: string;
    status?: MovieStatus;
    genreId?: string;
    language?: string;
    isFeatured?: boolean;
    limit?: number;
    page?: number;
}
