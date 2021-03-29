"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var orderSchema = new mongoose_1.default.Schema({
    orderId: String,
    user: {
        userId: String,
        username: String,
    },
    shipping: {
        customer: String,
        address: String,
        city: String,
        state: String,
        country: String,
    },
    payment: {
        method: String,
        paymentId: String,
    },
    products: [{
            productId: String,
            quantity: Number,
            productName: String,
            bookedFrom: Date,
            bookedTo: Date,
        }],
    totalAmount: Number,
    orderTimestamp: Date,
    status: String,
});
;
var Order = mongoose_1.default.model('Order', orderSchema);
exports.Order = Order;
