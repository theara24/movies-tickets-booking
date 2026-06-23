"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDailySales(date) {
        const queryDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(queryDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);
        const [payments, bookings, tickets] = await Promise.all([
            this.prisma.payment.aggregate({
                where: { paidAt: { gte: startOfDay, lte: endOfDay }, status: 'PAID' },
                _sum: { amount: true },
                _count: true,
            }),
            this.prisma.booking.count({
                where: { createdAt: { gte: startOfDay, lte: endOfDay } },
            }),
            this.prisma.ticket.count({
                where: { createdAt: { gte: startOfDay, lte: endOfDay } },
            }),
        ]);
        const foodRevenue = await this.prisma.foodOrder.aggregate({
            where: { createdAt: { gte: startOfDay, lte: endOfDay } },
            _sum: { totalAmount: true },
        });
        return {
            date: startOfDay.toISOString().split('T')[0],
            totalRevenue: payments._sum.amount || 0,
            transactionCount: payments._count,
            totalBookings: bookings,
            ticketsIssued: tickets,
            foodRevenue: foodRevenue._sum.totalAmount || 0,
        };
    }
    async getMonthlyRevenue(year, month) {
        const now = new Date();
        const targetYear = year || now.getFullYear();
        const targetMonth = month || now.getMonth() + 1;
        const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
        const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);
        const payments = await this.prisma.payment.findMany({
            where: { paidAt: { gte: startOfMonth, lte: endOfMonth }, status: 'PAID' },
            include: {
                booking: {
                    include: { showtime: { include: { movie: { select: { title: true } } } } },
                },
            },
            orderBy: { paidAt: 'asc' },
        });
        const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const byMethod = await this.prisma.payment.groupBy({
            by: ['paymentMethod'],
            where: { paidAt: { gte: startOfMonth, lte: endOfMonth }, status: 'PAID' },
            _sum: { amount: true },
            _count: true,
        });
        const movieRevenue = {};
        for (const p of payments) {
            const title = p.booking?.showtime?.movie?.title || 'Unknown';
            movieRevenue[title] = (movieRevenue[title] || 0) + Number(p.amount);
        }
        return {
            year: targetYear,
            month: targetMonth,
            totalRevenue,
            totalTransactions: payments.length,
            revenueByMethod: byMethod.map((m) => ({
                method: m.paymentMethod,
                amount: m._sum.amount || 0,
                count: m._count,
            })),
            topMovies: Object.entries(movieRevenue)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([movie, revenue]) => ({ movie, revenue })),
        };
    }
    async getTopMovies(startDate, endDate, limit = 10) {
        const where = { status: 'CONFIRMED' };
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const bookings = await this.prisma.booking.groupBy({
            by: ['showtimeId'],
            where,
            _count: true,
            _sum: { finalAmount: true },
            orderBy: { _count: { id: 'desc' } },
            take: limit,
        });
        const showtimeIds = bookings.map((b) => b.showtimeId);
        const showtimes = await this.prisma.showtime.findMany({
            where: { id: { in: showtimeIds } },
            include: { movie: { select: { id: true, title: true, posterUrl: true, rating: true } } },
        });
        return bookings.map((b) => {
            const showtime = showtimes.find((s) => s.id === b.showtimeId);
            return {
                movie: showtime?.movie || { id: 'unknown', title: 'Unknown', posterUrl: null, rating: null },
                totalBookings: b._count,
                totalRevenue: b._sum.finalAmount || 0,
            };
        });
    }
    async getSeatOccupancy(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            const showtimeWhere = {};
            if (startDate)
                showtimeWhere.gte = new Date(startDate);
            if (endDate)
                showtimeWhere.lte = new Date(endDate);
            if (Object.keys(showtimeWhere).length) {
                where.showtime = { startTime: showtimeWhere };
            }
        }
        const totalSeats = await this.prisma.seat.count();
        const bookedSeats = await this.prisma.bookingSeat.count({
            where: {
                booking: {
                    status: { in: ['CONFIRMED', 'PENDING'] },
                    ...where,
                },
            },
        });
        const totalShowtimes = await this.prisma.showtime.count({
            where: where.showtime || {},
        });
        const avgOccupancy = totalShowtimes > 0
            ? (bookedSeats / (totalSeats * totalShowtimes)) * 100
            : 0;
        return {
            totalSeats,
            bookedSeats,
            totalShowtimes,
            averageOccupancy: Math.round(avgOccupancy * 100) / 100,
        };
    }
    async getFoodRevenue(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [totalRevenue, totalOrders, topItems] = await Promise.all([
            this.prisma.foodOrder.aggregate({ where, _sum: { totalAmount: true } }),
            this.prisma.foodOrder.count({ where }),
            this.prisma.foodOrderItem.groupBy({
                by: ['foodItemId'],
                where,
                _sum: { quantity: true },
                _count: true,
                orderBy: { _sum: { quantity: 'desc' } },
                take: 10,
            }),
        ]);
        const foodItemIds = topItems.map((i) => i.foodItemId);
        const foodItems = await this.prisma.foodItem.findMany({
            where: { id: { in: foodItemIds } },
        });
        return {
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            totalOrders,
            topItems: topItems.map((item) => {
                const foodItem = foodItems.find((f) => f.id === item.foodItemId);
                return {
                    name: foodItem?.name || 'Unknown',
                    totalQuantity: item._sum.quantity || 0,
                    orderCount: item._count,
                };
            }),
        };
    }
    async getCancellationRate(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const [total, cancelled, refunded] = await Promise.all([
            this.prisma.booking.count({ where }),
            this.prisma.booking.count({ where: { ...where, status: 'CANCELLED' } }),
            this.prisma.booking.count({ where: { ...where, status: 'REFUNDED' } }),
        ]);
        const cancelledOrRefunded = cancelled + refunded;
        const cancellationRate = total > 0 ? (cancelledOrRefunded / total) * 100 : 0;
        return {
            totalBookings: total,
            cancelled,
            refunded,
            cancellationRate: Math.round(cancellationRate * 100) / 100,
        };
    }
    async getDashboard() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [dailySales, totalRevenue, totalUsers, totalMovies, activeBookings, upcomingShowtimes,] = await Promise.all([
            this.getDailySales(),
            this.prisma.payment.aggregate({
                where: { status: 'PAID' },
                _sum: { amount: true },
            }),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.movie.count({ where: { status: 'NOW_SHOWING' } }),
            this.prisma.booking.count({ where: { status: 'CONFIRMED' } }),
            this.prisma.showtime.count({
                where: { startTime: { gte: new Date() }, isActive: true, status: 'SCHEDULED' },
            }),
        ]);
        return {
            dailySales,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalUsers,
            activeMovies: totalMovies,
            activeBookings,
            upcomingShowtimes,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map