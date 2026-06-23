import { PrismaService } from '../../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { SeatLockGateway } from '../realtime/seat-lock.gateway';
export declare class BookingsService {
    private prisma;
    private seatLockGateway;
    constructor(prisma: PrismaService, seatLockGateway: SeatLockGateway);
    create(userId: string, dto: CreateBookingDto): Promise<{
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
    }>;
    findAll(query: BookingQueryDto, page?: number, limit?: number): Promise<{
        data: ({
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
                    title: string;
                    duration: number;
                    posterUrl: string | null;
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
            promotion: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                code: string;
                type: import(".prisma/client").$Enums.PromotionType;
                value: import("@prisma/client/runtime/library").Decimal;
                minAmount: import("@prisma/client/runtime/library").Decimal | null;
                maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
                usageLimit: number | null;
                usedCount: number;
                startsAt: Date;
                expiresAt: Date;
            } | null;
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
            } | null;
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
            } | null;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            phone: string | null;
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
        promotion: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            type: import(".prisma/client").$Enums.PromotionType;
            value: import("@prisma/client/runtime/library").Decimal;
            minAmount: import("@prisma/client/runtime/library").Decimal | null;
            maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
            usageLimit: number | null;
            usedCount: number;
            startsAt: Date;
            expiresAt: Date;
        } | null;
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
        } | null;
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
        } | null;
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
    }>;
    findByUser(userId: string, page?: number, limit?: number): Promise<{
        data: ({
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
                    title: string;
                    duration: number;
                    posterUrl: string | null;
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
            promotion: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                code: string;
                type: import(".prisma/client").$Enums.PromotionType;
                value: import("@prisma/client/runtime/library").Decimal;
                minAmount: import("@prisma/client/runtime/library").Decimal | null;
                maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
                usageLimit: number | null;
                usedCount: number;
                startsAt: Date;
                expiresAt: Date;
            } | null;
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
            } | null;
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
            } | null;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findByReference(ref: string): Promise<{
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
        promotion: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            code: string;
            type: import(".prisma/client").$Enums.PromotionType;
            value: import("@prisma/client/runtime/library").Decimal;
            minAmount: import("@prisma/client/runtime/library").Decimal | null;
            maxDiscount: import("@prisma/client/runtime/library").Decimal | null;
            usageLimit: number | null;
            usedCount: number;
            startsAt: Date;
            expiresAt: Date;
        } | null;
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
        } | null;
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
        } | null;
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
    }>;
    cancelBooking(id: string, userId: string): Promise<{
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
    }>;
    getBookingSummary(userId: string): Promise<{
        totalBookings: number;
        activeBookings: number;
        cancelledBookings: number;
        totalSpent: number | import("@prisma/client/runtime/library").Decimal;
    }>;
}
