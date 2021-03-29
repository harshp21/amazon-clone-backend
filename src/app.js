"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing 
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var mongoose_1 = __importDefault(require("mongoose"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var user_route_1 = __importDefault(require("./routes/user/user-route"));
var product_route_1 = __importDefault(require("./routes/product/product-route"));
var cart_route_1 = __importDefault(require("./routes/cart/cart-route"));
var book_route_1 = __importDefault(require("./routes/book/book-route"));
var payment_route_1 = __importDefault(require("./routes/payment/payment-route"));
var order_route_1 = __importDefault(require("./routes/order/order-route"));
// app config
var app = express_1.default();
dotenv_1.default.config();
var port = process.env.PORT || 5000;
// middleware
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(cors_1.default({
    origin: process.env.REQUEST_ORIGIN
}));
// routes
app.use('/user', user_route_1.default);
app.use('/products', product_route_1.default);
app.use('/cart', cart_route_1.default);
app.use('/book', book_route_1.default);
app.use('/payment', payment_route_1.default);
app.use('/orders', order_route_1.default);
// db config
var connectionUrl = process.env.MONGODB_CONNECTION_URL;
mongoose_1.default.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(function () { return console.log("Successfully connected to mongodb"); }).catch(function (err) { return console.log("mongo error", err); });
// listen on port
app.listen(port, function () { return console.log("listening on port : " + port); });
