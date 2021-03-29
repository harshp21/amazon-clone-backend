"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var productSchema = new mongoose_1.default.Schema({
    productName: String,
    productTitle: String,
    productDescription: String,
    quantityAvailable: Number,
    productCategory: [{
            categoryId: String,
            categoryTag: String,
        }],
    manufactureDetails: {
        model_number: String,
        release_date: Date,
        brand: String,
    },
    pricing: {
        productPrice: Number,
        currency: String,
    }
});
;
var Product = mongoose_1.default.model('Product', productSchema);
exports.Product = Product;
