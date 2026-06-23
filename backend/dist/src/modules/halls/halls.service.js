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
exports.HallsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let HallsService = class HallsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const capacity = dto.capacity || dto.rows * dto.columns;
        const hall = await this.prisma.hall.create({
            data: {
                name: dto.name,
                cinemaId: dto.cinemaId,
                rows: dto.rows,
                columns: dto.columns,
                capacity,
            },
        });
        const seats = [];
        const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let r = 0; r < dto.rows; r++) {
            for (let c = 0; c < dto.columns; c++) {
                seats.push({
                    hallId: hall.id,
                    row: rowLabels[r],
                    column: String(c + 1),
                    number: r * dto.columns + c + 1,
                    type: client_1.SeatType.STANDARD,
                });
            }
        }
        await this.prisma.seat.createMany({ data: seats });
        return this.prisma.hall.findUnique({
            where: { id: hall.id },
            include: { seats: { orderBy: { number: 'asc' } } },
        });
    }
    async findAll(cinemaId) {
        const where = cinemaId ? { cinemaId } : {};
        return this.prisma.hall.findMany({
            where,
            include: { _count: { select: { seats: true, showtimes: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const hall = await this.prisma.hall.findUnique({
            where: { id },
            include: {
                seats: {
                    orderBy: [{ row: 'asc' }, { column: 'asc' }],
                },
                cinema: true,
            },
        });
        if (!hall)
            throw new common_1.NotFoundException('Hall not found');
        return hall;
    }
    async update(id, dto) {
        const hall = await this.prisma.hall.findUnique({ where: { id } });
        if (!hall)
            throw new common_1.NotFoundException('Hall not found');
        return this.prisma.hall.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const hall = await this.prisma.hall.findUnique({ where: { id } });
        if (!hall)
            throw new common_1.NotFoundException('Hall not found');
        await this.prisma.hall.update({ where: { id }, data: { isActive: false } });
        return { message: 'Hall deactivated successfully' };
    }
    async bulkCreateSeats(seats) {
        const hallId = seats[0]?.hallId;
        const hall = await this.prisma.hall.findUnique({ where: { id: hallId } });
        if (!hall)
            throw new common_1.NotFoundException('Hall not found');
        await this.prisma.seat.createMany({
            data: seats,
            skipDuplicates: true,
        });
        return this.prisma.seat.findMany({ where: { hallId }, orderBy: { number: 'asc' } });
    }
};
exports.HallsService = HallsService;
exports.HallsService = HallsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HallsService);
//# sourceMappingURL=halls.service.js.map