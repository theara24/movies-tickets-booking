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
exports.GenresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let GenresService = class GenresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.genre.findFirst({
            where: { OR: [{ name: dto.name }, { slug: dto.slug }] },
        });
        if (existing)
            throw new common_1.ConflictException('Genre name or slug already exists');
        return this.prisma.genre.create({ data: dto });
    }
    async findAll() {
        return this.prisma.genre.findMany({
            include: { _count: { select: { movies: true } } },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(id) {
        const genre = await this.prisma.genre.findUnique({
            where: { id },
            include: { movies: { include: { movie: true } } },
        });
        if (!genre)
            throw new common_1.NotFoundException('Genre not found');
        return genre;
    }
    async update(id, dto) {
        const genre = await this.prisma.genre.findUnique({ where: { id } });
        if (!genre)
            throw new common_1.NotFoundException('Genre not found');
        return this.prisma.genre.update({ where: { id }, data: dto });
    }
    async remove(id) {
        const genre = await this.prisma.genre.findUnique({ where: { id } });
        if (!genre)
            throw new common_1.NotFoundException('Genre not found');
        await this.prisma.genre.delete({ where: { id } });
        return { message: 'Genre deleted successfully' };
    }
};
exports.GenresService = GenresService;
exports.GenresService = GenresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GenresService);
//# sourceMappingURL=genres.service.js.map