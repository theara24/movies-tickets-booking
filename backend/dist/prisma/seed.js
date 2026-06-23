"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const staffPassword = await bcrypt.hash('Staff@123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@cinepremium.com' },
        update: {},
        create: {
            email: 'admin@cinepremium.com',
            password: adminPassword,
            fullName: 'System Admin',
            role: client_1.UserRole.ADMIN,
            isActive: true,
        },
    });
    const manager = await prisma.user.upsert({
        where: { email: 'manager@cinepremium.com' },
        update: {},
        create: {
            email: 'manager@cinepremium.com',
            password: staffPassword,
            fullName: 'Cinema Manager',
            role: client_1.UserRole.CINEMA_MANAGER,
            isActive: true,
        },
    });
    const cashier = await prisma.user.upsert({
        where: { email: 'cashier@cinepremium.com' },
        update: {},
        create: {
            email: 'cashier@cinepremium.com',
            password: staffPassword,
            fullName: 'Counter Cashier',
            role: client_1.UserRole.CASHIER,
            isActive: true,
        },
    });
    const customer = await prisma.user.upsert({
        where: { email: 'customer@cinepremium.com' },
        update: {},
        create: {
            email: 'customer@cinepremium.com',
            password: await bcrypt.hash('Customer@123', 12),
            fullName: 'John Customer',
            role: client_1.UserRole.CUSTOMER,
            isActive: true,
        },
    });
    console.log('Users created');
    await prisma.customer.upsert({
        where: { userId: customer.id },
        update: {},
        create: {
            userId: customer.id,
            points: 100,
            tier: 'REGULAR',
        },
    });
    const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation', 'Adventure', 'Documentary'];
    const genreMap = new Map();
    for (const name of genres) {
        const genre = await prisma.genre.upsert({
            where: { name },
            update: {},
            create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
        });
        genreMap.set(name, genre.id);
    }
    console.log('Genres created');
    const cinema = await prisma.cinema.upsert({
        where: { slug: 'cinepremium-pp' },
        update: {},
        create: {
            name: 'CinePremium Phnom Penh',
            slug: 'cinepremium-pp',
            address: '123 Preah Monivong Blvd',
            city: 'Phnom Penh',
            phone: '+855 23 888 999',
            email: 'pp@cinepremium.com',
        },
    });
    console.log('Cinema created');
    const hall = await prisma.hall.create({
        data: {
            name: 'Hall 1',
            cinemaId: cinema.id,
            rows: 8,
            columns: 10,
            capacity: 80,
        },
    });
    const seats = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 10; c++) {
            const seatNum = r * 10 + c + 1;
            let type = client_1.SeatType.STANDARD;
            if (r < 2)
                type = client_1.SeatType.VIP;
            if (seatNum === 40 || seatNum === 41)
                type = client_1.SeatType.COUPLE;
            if (seatNum === 1)
                type = client_1.SeatType.WHEELCHAIR;
            seats.push({
                hallId: hall.id,
                row: rowLabels[r],
                column: String(c + 1),
                number: seatNum,
                type,
            });
        }
    }
    await prisma.seat.createMany({ data: seats, skipDuplicates: true });
    console.log('Hall and seats created');
    const movies = [
        {
            title: 'Avengers: Secret Wars',
            description: 'The epic conclusion to the Multiverse Saga. Earth mightiest heroes face their greatest challenge yet.',
            duration: 180,
            language: 'English',
            rating: 'PG-13',
            posterUrl: 'https://image.tmdb.org/t/p/w500/avengers-secret-wars.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=example1',
            releaseDate: new Date('2026-07-24'),
            status: client_1.MovieStatus.NOW_SHOWING,
        },
        {
            title: 'The Dark Knight Rises',
            description: 'Batman returns to save Gotham City from the terrorist Bane.',
            duration: 165,
            language: 'English',
            rating: 'PG-13',
            posterUrl: 'https://image.tmdb.org/t/p/w500/dark-knight.jpg',
            trailerUrl: 'https://www.youtube.com/watch?v=example2',
            releaseDate: new Date('2026-06-15'),
            status: client_1.MovieStatus.NOW_SHOWING,
        },
        {
            title: 'Interstellar 2',
            description: 'A new journey beyond the stars as humanity seeks a new home.',
            duration: 169,
            language: 'English',
            rating: 'PG-13',
            posterUrl: 'https://image.tmdb.org/t/p/w500/interstellar.jpg',
            releaseDate: new Date('2026-12-20'),
            status: client_1.MovieStatus.COMING_SOON,
        },
    ];
    for (const movieData of movies) {
        const movie = await prisma.movie.create({
            data: {
                ...movieData,
                genres: {
                    create: [
                        { genreId: genreMap.get('Action') },
                        { genreId: genreMap.get('Sci-Fi') },
                        { genreId: genreMap.get('Adventure') },
                    ],
                },
            },
        });
        const startTime = new Date();
        startTime.setDate(startTime.getDate() + 1);
        startTime.setHours(14, 0, 0, 0);
        await prisma.showtime.create({
            data: {
                movieId: movie.id,
                cinemaId: cinema.id,
                hallId: hall.id,
                startTime,
                endTime: new Date(startTime.getTime() + movieData.duration * 60000),
                price: 12.00,
            },
        });
    }
    console.log('Movies and showtimes created');
    const promotions = [
        {
            code: 'WELCOME20',
            description: '20% off for new customers',
            type: 'PERCENTAGE',
            value: 20,
            minAmount: 10,
            maxDiscount: 10,
            usageLimit: 100,
            startsAt: new Date(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        {
            code: 'FLAT5',
            description: '$5 off any booking',
            type: 'FIXED',
            value: 5,
            minAmount: 15,
            usageLimit: 50,
            startsAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        {
            code: 'STUDENT25',
            description: '25% discount for students',
            type: 'STUDENT',
            value: 25,
            minAmount: 5,
            maxDiscount: 8,
            usageLimit: 200,
            startsAt: new Date(),
            expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        },
    ];
    for (const promo of promotions) {
        await prisma.promotion.upsert({
            where: { code: promo.code },
            update: {},
            create: promo,
        });
    }
    console.log('Promotions created');
    const foodItems = [
        { name: 'Large Popcorn', price: 5.50, category: 'POPCORN', stock: 100 },
        { name: 'Medium Popcorn', price: 4.00, category: 'POPCORN', stock: 100 },
        { name: 'Coca-Cola Large', price: 3.50, category: 'DRINKS', stock: 200 },
        { name: 'Coca-Cola Medium', price: 2.50, category: 'DRINKS', stock: 200 },
        { name: 'Nachos', price: 4.50, category: 'HOT_FOOD', stock: 50 },
        { name: 'Hot Dog', price: 3.00, category: 'HOT_FOOD', stock: 50 },
        { name: 'M&M Pack', price: 2.00, category: 'CANDY', stock: 150 },
        { name: 'Combo #1 (Popcorn + Drink)', price: 7.00, category: 'COMBO', stock: 100 },
    ];
    for (const item of foodItems) {
        await prisma.foodItem.create({ data: item });
    }
    console.log('Food items created');
    console.log('Seeding complete!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map