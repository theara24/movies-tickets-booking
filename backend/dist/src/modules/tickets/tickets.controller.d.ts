import { TicketsService } from './tickets.service';
export declare class TicketsController {
    private ticketsService;
    constructor(ticketsService: TicketsService);
    getMyTickets(userId: string, page?: string, limit?: string): Promise<{
        data: ({
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
            status: import(".prisma/client").$Enums.TicketStatus;
            expiresAt: Date;
            bookingId: string;
            ticketRef: string;
            qrCode: string;
            qrData: string;
            usedAt: Date | null;
            scannedBy: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    validateTicket(ticketRef: string): Promise<{
        valid: boolean;
        ticket: {
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
            status: import(".prisma/client").$Enums.TicketStatus;
            expiresAt: Date;
            bookingId: string;
            ticketRef: string;
            qrCode: string;
            qrData: string;
            usedAt: Date | null;
            scannedBy: string | null;
        };
        message: string;
    }>;
    scanTicket(ticketRef: string, userId: string): Promise<{
        message: string;
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
    getTicketByBooking(bookingId: string): Promise<{
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
        status: import(".prisma/client").$Enums.TicketStatus;
        expiresAt: Date;
        bookingId: string;
        ticketRef: string;
        qrCode: string;
        qrData: string;
        usedAt: Date | null;
        scannedBy: string | null;
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
        status: import(".prisma/client").$Enums.TicketStatus;
        expiresAt: Date;
        bookingId: string;
        ticketRef: string;
        qrCode: string;
        qrData: string;
        usedAt: Date | null;
        scannedBy: string | null;
    }>;
    findByReference(ticketRef: string): Promise<{
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
        status: import(".prisma/client").$Enums.TicketStatus;
        expiresAt: Date;
        bookingId: string;
        ticketRef: string;
        qrCode: string;
        qrData: string;
        usedAt: Date | null;
        scannedBy: string | null;
    }>;
}
