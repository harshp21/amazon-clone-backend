"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var categorySchema = new mongoose_1.default.Schema({
    categoryName: String,
    categoryDescription: String,
    isActive: {
        type: Boolean,
        default: true,
    },
});
;
var Category = mongoose_1.default.model("Category", categorySchema);
exports.Category = Category;
// [{
//     "categroryName": "Electronics",
//     "categoryDescription": "Electronics gadgets and accessories",
// },
// {
//     "categroryName": "Clothing",
//     "categoryDescription": "Best fashion and clothing in market",
// }, {
//     "categroryName": "Footware",
//     "categoryDescription": "Best fashion and footware in market",
// }, {
//     "categroryName": "Home Appliances",
//     "categoryDescription": "Best Home applicances ranging for all prices",
// }]
