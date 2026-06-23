"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFoodItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_food_item_dto_1 = require("./create-food-item.dto");
class UpdateFoodItemDto extends (0, swagger_1.PartialType)(create_food_item_dto_1.CreateFoodItemDto) {
}
exports.UpdateFoodItemDto = UpdateFoodItemDto;
//# sourceMappingURL=update-food-item.dto.js.map