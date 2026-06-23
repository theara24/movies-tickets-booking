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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowtimesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const showtimes_service_1 = require("./showtimes.service");
const create_showtime_dto_1 = require("./dto/create-showtime.dto");
const update_showtime_dto_1 = require("./dto/update-showtime.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const client_1 = require("@prisma/client");
let ShowtimesController = class ShowtimesController {
    showtimesService;
    constructor(showtimesService) {
        this.showtimesService = showtimesService;
    }
    create(dto) {
        return this.showtimesService.create(dto);
    }
    findAll(movieId, cinemaId, date, page, limit) {
        return this.showtimesService.findAll({
            movieId, cinemaId, date,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }
    getByMovie(movieId, cinemaId, date) {
        return this.showtimesService.getShowtimesByMovie(movieId, cinemaId, date);
    }
    getByDate(date, cinemaId) {
        return this.showtimesService.getShowtimesByDate(date, cinemaId);
    }
    findOne(id) {
        return this.showtimesService.findOne(id);
    }
    update(id, dto) {
        return this.showtimesService.update(id, dto);
    }
    remove(id) {
        return this.showtimesService.remove(id);
    }
};
exports.ShowtimesController = ShowtimesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.CINEMA_MANAGER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a showtime' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_showtime_dto_1.CreateShowtimeDto]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all showtimes' }),
    (0, swagger_1.ApiQuery)({ name: 'movieId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'cinemaId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, common_1.Query)('movieId')),
    __param(1, (0, common_1.Query)('cinemaId')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('by-movie/:movieId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get showtimes by movie' }),
    __param(0, (0, common_1.Param)('movieId')),
    __param(1, (0, common_1.Query)('cinemaId')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "getByMovie", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('by-date/:date'),
    (0, swagger_1.ApiOperation)({ summary: 'Get showtimes by date' }),
    __param(0, (0, common_1.Param)('date')),
    __param(1, (0, common_1.Query)('cinemaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "getByDate", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get showtime by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.CINEMA_MANAGER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update showtime' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_showtime_dto_1.UpdateShowtimeDto]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.CINEMA_MANAGER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel showtime' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShowtimesController.prototype, "remove", null);
exports.ShowtimesController = ShowtimesController = __decorate([
    (0, swagger_1.ApiTags)('Showtimes'),
    (0, common_1.Controller)('showtimes'),
    __metadata("design:paramtypes", [showtimes_service_1.ShowtimesService])
], ShowtimesController);
//# sourceMappingURL=showtimes.controller.js.map