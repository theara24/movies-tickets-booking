declare class OrderItemDto {
    foodItemId: string;
    quantity: number;
}
export declare class CreateFoodOrderDto {
    bookingId: string;
    items: OrderItemDto[];
    notes?: string;
}
export {};
