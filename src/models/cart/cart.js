"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var cartSchema = new mongoose_1.default.Schema({
    cartProducts: [{
            productId: String,
            quantity: Number,
            productName: String,
            isGift: {
                type: Boolean,
                default: false,
            },
            pricing: {
                productPrice: Number,
                currency: String,
            }
        }],
    totalCartAmount: Number,
    userId: String,
    status: {
        type: String,
        default: 'active'
    },
});
var Cart = mongoose_1.default.model('Cart', cartSchema);
exports.Cart = Cart;
