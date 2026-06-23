import { PaymentMethod } from '@prisma/client';
export declare class ProcessPaymentDto {
    bookingId: string;
    paymentMethod: PaymentMethod;
}
