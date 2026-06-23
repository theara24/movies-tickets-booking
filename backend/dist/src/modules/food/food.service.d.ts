import { PrismaService } from '../../database/prisma.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { UpdateFoodItemDto } from './dto/update-food-item.dto';
import { CreateFoodOrderDto } from './dto/create-food-order.dto';
export declare class FoodService {
    private prisma;
    constructor(prisma: PrismaService);
    createItem(dto: CreateFoodItemDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        category: import(".prisma/client").$Enums.FoodCategory;
        stock: number;
    }>;
    findAllItems(category?: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        category: import(".prisma/client").$Enums.FoodCategory;
        stock: number;
    }[]>;
    findOneItem(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        category: import(".prisma/client").$Enums.FoodCategory;
        stock: number;
    }>;
    updateItem(id: string, dto: UpdateFoodItemDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        imageUrl: string | null;
        description: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        category: import(".prisma/client").$Enums.FoodCategory;
        stock: number;
    }>;
    removeItem(id: string): Promise<{
        message: string;
    }>;
    createOrder(userId: string, dto: CreateFoodOrderDto): Promise<{
        items: ({
            foodItem: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                imageUrl: string | null;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                category: import(".prisma/client").$Enums.FoodCategory;
                stock: number;
            };
        } & {
            id: string;
            createdAt: Date;
            foodItemId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        orderRef: string;
        customerId: string | null;
    }>;
    findOrdersByBooking(bookingId: string): Promise<{
        items: ({
            foodItem: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                imageUrl: string | null;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                category: import(".prisma/client").$Enums.FoodCategory;
                stock: number;
            };
        } & {
            id: string;
            createdAt: Date;
            foodItemId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        orderRef: string;
        customerId: string | null;
    }>;
    findOrdersByUser(userId: string): Promise<({
        booking: {
            bookingRef: string;
        };
        items: ({
            foodItem: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                imageUrl: string | null;
                description: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                category: import(".prisma/client").$Enums.FoodCategory;
                stock: number;
            };
        } & {
            id: string;
            createdAt: Date;
            foodItemId: string;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bookingId: string;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        notes: string | null;
        orderRef: string;
        customerId: string | null;
    })[]>;
    findAllOrders(page?: number, limit?: number): Promise<{
        data: ({
            booking: {
                bookingRef: string;
            };
            items: ({
                foodItem: {
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    imageUrl: string | null;
                    description: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                    category: import(".prisma/client").$Enums.FoodCategory;
                    stock: number;
                };
            } & {
                id: string;
                createdAt: Date;
                foodItemId: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            orderRef: string;
            customerId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
