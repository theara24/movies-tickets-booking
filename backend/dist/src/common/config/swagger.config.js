"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('CinePremium API')
    .setDescription('Movie Ticket Booking Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Movies', 'Movie management')
    .addTag('Genres', 'Genre management')
    .addTag('Cinemas', 'Cinema management')
    .addTag('Halls', 'Hall management')
    .addTag('Seats', 'Seat management')
    .addTag('Showtimes', 'Showtime management')
    .addTag('Bookings', 'Booking management')
    .addTag('Payments', 'Payment processing')
    .addTag('Tickets', 'Ticket management')
    .addTag('Promotions', 'Promotion management')
    .addTag('Food & Beverage', 'Food and beverage management')
    .addTag('Reports', 'Reporting and analytics')
    .addTag('Notifications', 'Notification management')
    .build();
//# sourceMappingURL=swagger.config.js.map