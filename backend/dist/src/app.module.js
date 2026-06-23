"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./database/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const movies_module_1 = require("./modules/movies/movies.module");
const genres_module_1 = require("./modules/genres/genres.module");
const cinemas_module_1 = require("./modules/cinemas/cinemas.module");
const halls_module_1 = require("./modules/halls/halls.module");
const seats_module_1 = require("./modules/seats/seats.module");
const showtimes_module_1 = require("./modules/showtimes/showtimes.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const payments_module_1 = require("./modules/payments/payments.module");
const tickets_module_1 = require("./modules/tickets/tickets.module");
const promotions_module_1 = require("./modules/promotions/promotions.module");
const food_module_1 = require("./modules/food/food.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const audit_logs_module_1 = require("./modules/audit-logs/audit-logs.module");
const reports_module_1 = require("./modules/reports/reports.module");
const realtime_module_1 = require("./modules/realtime/realtime.module");
const app_config_1 = __importDefault(require("./common/config/app.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: parseInt(process.env.THROTTLE_TTL || '60000', 10),
                    limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            movies_module_1.MoviesModule,
            genres_module_1.GenresModule,
            cinemas_module_1.CinemasModule,
            halls_module_1.HallsModule,
            seats_module_1.SeatsModule,
            showtimes_module_1.ShowtimesModule,
            bookings_module_1.BookingsModule,
            payments_module_1.PaymentsModule,
            tickets_module_1.TicketsModule,
            promotions_module_1.PromotionsModule,
            food_module_1.FoodModule,
            notifications_module_1.NotificationsModule,
            audit_logs_module_1.AuditLogsModule,
            reports_module_1.ReportsModule,
            realtime_module_1.RealtimeModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map