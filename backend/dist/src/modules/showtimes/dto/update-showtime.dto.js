"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShowtimeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_showtime_dto_1 = require("./create-showtime.dto");
class UpdateShowtimeDto extends (0, swagger_1.PartialType)(create_showtime_dto_1.CreateShowtimeDto) {
}
exports.UpdateShowtimeDto = UpdateShowtimeDto;
//# sourceMappingURL=update-showtime.dto.js.map