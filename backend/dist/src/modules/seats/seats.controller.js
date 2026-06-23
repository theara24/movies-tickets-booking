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
exports.SeatsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const seats_service_1 = require("./seats.service");
const update_seat_dto_1 = require("./dto/update-seat.dto");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const rbac_guard_1 = require("../../common/guards/rbac.guard");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const client_1 = require("@prisma/client");
let SeatsController = class SeatsController {
    seatsService;
    constructor(seatsService) {
        this.seatsService = seatsService;
    }
    findByHall(hallId) {
        return this.seatsService.findByHall(hallId);
    }
    getAvailableSeats(showtimeId) {
        return this.seatsService.getAvailableSeats(showtimeId);
    }
    findOne(id) {
        return this.seatsService.findOne(id);
    }
    update(id, dto) {
        return this.seatsService.update(id, dto);
    }
};
exports.SeatsController = SeatsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('hall/:hallId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get seats by hall' }),
    __param(0, (0, common_1.Param)('hallId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "findByHall", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('available/:showtimeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available seats for a showtime' }),
    __param(0, (0, common_1.Param)('showtimeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "getAvailableSeats", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get seat by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), rbac_guard_1.RbacGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.CINEMA_MANAGER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update seat' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_seat_dto_1.UpdateSeatDto]),
    __metadata("design:returntype", void 0)
], SeatsController.prototype, "update", null);
exports.SeatsController = SeatsController = __decorate([
    (0, swagger_1.ApiTags)('Seats'),
    (0, common_1.Controller)('seats'),
    __metadata("design:paramtypes", [seats_service_1.SeatsService])
], SeatsController);
//# sourceMappingURL=seats.controller.js.map