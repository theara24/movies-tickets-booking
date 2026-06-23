import { FoodCategory } from '@prisma/client';
export declare class CreateFoodItemDto {
    name: string;
    description?: string;
    price: number;
    category?: FoodCategory;
    imageUrl?: string;
    stock?: number;
    isActive?: boolean;
}
