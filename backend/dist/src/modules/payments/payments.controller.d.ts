import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    processPayment(userId: string, dto: ProcessPaymentDto): Promise<{
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: string;
            paidAt: Date | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentRef: string;
            transactionId: string | null;
            receiptUrl: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
        ticket: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TicketStatus;
            expiresAt: Date;
            bookingId: string;
            ticketRef: string;
            qrCode: string;
            qrData: string;
            usedAt: Date | null;
            scannedBy: string | null;
        };
    }>;
    findAll(status?: string, page?: string, limit?: string): Promise<{
        data: ({
            booking: {
                showtime: {
                    movie: {
                        title: string;
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
                };
                bookingSeats: ({
                    seat: {
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
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    price: import("@prisma/client/runtime/library").Decimal;
                    bookingId: string;
                    seatId: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                status: import(".prisma/client").$Enums.BookingStatus;
                bookingRef: string;
                showtimeId: string;
                promotionId: string | null;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                discountAmount: import("@prisma/client/runtime/library").Decimal;
                finalAmount: import("@prisma/client/runtime/library").Decimal;
                paidAt: Date | null;
                cancelledAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: string;
            paidAt: Date | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentRef: string;
            transactionId: string | null;
            receiptUrl: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyPayments(userId: string, page?: string, limit?: string): Promise<{
        data: ({
            booking: {
                showtime: {
                    movie: {
                        title: string;
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
                };
                bookingSeats: ({
                    seat: {
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
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    price: import("@prisma/client/runtime/library").Decimal;
                    bookingId: string;
                    seatId: string;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                status: import(".prisma/client").$Enums.BookingStatus;
                bookingRef: string;
                showtimeId: string;
                promotionId: string | null;
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                discountAmount: import("@prisma/client/runtime/library").Decimal;
                finalAmount: import("@prisma/client/runtime/library").Decimal;
                paidAt: Date | null;
                cancelledAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            bookingId: string;
            paidAt: Date | null;
            amount: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
            paymentRef: string;
            transactionId: string | null;
            receiptUrl: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findByBooking(bookingId: string): Promise<{
        booking: {
            showtime: {
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
            };
            bookingSeats: ({
                seat: {
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
                };
            } & {
                id: string;
                createdAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                bookingId: string;
                seatId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            bookingRef: string;
            showtimeId: string;
            promotionId: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            finalAmount: import("@prisma/client/runtime/library").Decimal;
            paidAt: Date | null;
            cancelledAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        paidAt: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentRef: string;
        transactionId: string | null;
        receiptUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findOne(id: string): Promise<{
        booking: {
            user: {
                email: string;
                fullName: string;
            };
            showtime: {
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
            };
            bookingSeats: ({
                seat: {
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
                };
            } & {
                id: string;
                createdAt: Date;
                price: import("@prisma/client/runtime/library").Decimal;
                bookingId: string;
                seatId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.BookingStatus;
            bookingRef: string;
            showtimeId: string;
            promotionId: string | null;
            totalAmount: import("@prisma/client/runtime/library").Decimal;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
            finalAmount: import("@prisma/client/runtime/library").Decimal;
            paidAt: Date | null;
            cancelledAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        bookingId: string;
        paidAt: Date | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        paymentRef: string;
        transactionId: string | null;
        receiptUrl: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    refundPayment(id: string): Promise<{
        message: string;
    }>;
}
