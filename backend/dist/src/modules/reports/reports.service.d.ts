import { PrismaService } from '../../database/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDailySales(date?: string): Promise<{
        date: string;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        transactionCount: number;
        totalBookings: number;
        ticketsIssued: number;
        foodRevenue: number | import("@prisma/client/runtime/library").Decimal;
    }>;
    getMonthlyRevenue(year?: number, month?: number): Promise<{
        year: number;
        month: number;
        totalRevenue: number;
        totalTransactions: number;
        revenueByMethod: {
            method: import(".prisma/client").$Enums.PaymentMethod;
            amount: number | import("@prisma/client/runtime/library").Decimal;
            count: number;
        }[];
        topMovies: {
            movie: string;
            revenue: number;
        }[];
    }>;
    getTopMovies(startDate?: string, endDate?: string, limit?: number): Promise<{
        movie: {
            id: string;
            title: string;
            rating: string;
            posterUrl: string | null;
        } | {
            id: string;
            title: string;
            posterUrl: null;
            rating: null;
        };
        totalBookings: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
    }[]>;
    getSeatOccupancy(startDate?: string, endDate?: string): Promise<{
        totalSeats: number;
        bookedSeats: number;
        totalShowtimes: number;
        averageOccupancy: number;
    }>;
    getFoodRevenue(startDate?: string, endDate?: string): Promise<{
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalOrders: number;
        topItems: {
            name: string;
            totalQuantity: number;
            orderCount: number;
        }[];
    }>;
    getCancellationRate(startDate?: string, endDate?: string): Promise<{
        totalBookings: number;
        cancelled: number;
        refunded: number;
        cancellationRate: number;
    }>;
    getDashboard(): Promise<{
        dailySales: {
            date: string;
            totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
            transactionCount: number;
            totalBookings: number;
            ticketsIssued: number;
            foodRevenue: number | import("@prisma/client/runtime/library").Decimal;
        };
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        totalUsers: number;
        activeMovies: number;
        activeBookings: number;
        upcomingShowtimes: number;
    }>;
}
