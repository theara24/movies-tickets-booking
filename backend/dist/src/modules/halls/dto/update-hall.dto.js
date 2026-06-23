"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHallDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_hall_dto_1 = require("./create-hall.dto");
class UpdateHallDto extends (0, swagger_1.PartialType)(create_hall_dto_1.CreateHallDto) {
}
exports.UpdateHallDto = UpdateHallDto;
//# sourceMappingURL=update-hall.dto.js.map