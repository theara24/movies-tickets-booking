"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCinemaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_cinema_dto_1 = require("./create-cinema.dto");
class UpdateCinemaDto extends (0, swagger_1.PartialType)(create_cinema_dto_1.CreateCinemaDto) {
}
exports.UpdateCinemaDto = UpdateCinemaDto;
//# sourceMappingURL=update-cinema.dto.js.map