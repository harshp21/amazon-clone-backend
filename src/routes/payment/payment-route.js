"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing
var express_1 = __importDefault(require("express"));
var razorpay_1 = __importDefault(require("razorpay"));
var crypto_1 = __importDefault(require("crypto"));
var short_unique_id_1 = __importDefault(require("short-unique-id"));
var authentication_service_1 = require("../../service/authentication-service/authentication-service");
var order_1 = require("../../models/order/order");
var cart_1 = require("../../models/cart/cart");
// router config
var router = express_1.default.Router();
router.post('/orders', authentication_service_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var totalAmount, instance, uid, options, order, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                totalAmount = req.body.totalAmount;
                instance = new razorpay_1.default({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_SECRET,
                });
                uid = new short_unique_id_1.default();
                options = {
                    amount: parseInt(totalAmount) * 100,
                    currency: 'INR',
                    receipt: "receipt_order_" + uid(),
                };
                return [4 /*yield*/, instance.orders.create(options)];
            case 1:
                order = _a.sent();
                if (!order)
                    return [2 /*return*/, res.status(500).send("Some error occured")];
                res.json({
                    message: 'Successfully created an order',
                    order: order
                });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(500).json({
                    message: 'Amount exceeds maximum amount allowed (i.e: 20,000 rupees)'
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/verification', authentication_service_1.authenticate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentData, userId, username, SECRET, shasum, digest, isTransactionValid, order, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, orderCreationId = _a.orderCreationId, razorpayPaymentId = _a.razorpayPaymentId, razorpayOrderId = _a.razorpayOrderId, razorpaySignature = _a.razorpaySignature, paymentData = _a.paymentData, userId = _a.userId, username = _a.username;
                SECRET = process.env.RAZORPAY_SECRET;
                shasum = crypto_1.default.createHmac("sha256", SECRET);
                shasum.update(orderCreationId + "|" + razorpayPaymentId);
                digest = shasum.digest("hex");
                isTransactionValid = digest === razorpaySignature;
                order = new order_1.Order({
                    user: {
                        userId: userId,
                        username: username,
                    },
                    orderId: razorpayOrderId,
                    payment: {
                        paymentId: razorpayPaymentId,
                    },
                    products: paymentData.products.map(function (product) {
                        return {
                            productId: product._id,
                            quantity: product.quantity,
                            productName: product.productName,
                            isGift: product.isGift
                        };
                    }),
                    shipping: {
                        customer: username,
                        address: paymentData.shippingDetails.apartment + "," + paymentData.shippingDetails.area + ", " + paymentData.shippingDetails.landmark,
                        city: paymentData.shippingDetails.city + " ",
                        state: "" + paymentData.shippingDetails.state,
                        country: " " + paymentData.shippingDetails.country + "-" + paymentData.shippingDetails.pinCode,
                    },
                    totalAmount: paymentData.totalAmount,
                    orderTimestamp: new Date(),
                    status: isTransactionValid ? 'Success' : 'Failure',
                });
                return [4 /*yield*/, order.save()];
            case 1:
                result = _b.sent();
                // clear the cart after successfull booking
                return [4 /*yield*/, cart_1.Cart.updateOne({ userId: userId }, { $set: { cartProducts: [], totalCartAmount: 0 } })];
            case 2:
                // clear the cart after successfull booking
                _b.sent();
                // comparing our digest with the actual signature
                if (!isTransactionValid)
                    return [2 /*return*/, res.status(400).json({ msg: "Transaction not legit!" })];
                // send response msg
                res.json({
                    msg: "Booking successfully done",
                    result: result
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(500).send(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
