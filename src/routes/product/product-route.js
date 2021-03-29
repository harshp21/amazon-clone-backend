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
//importing
var express_1 = __importDefault(require("express"));
var category_1 = require("../../models/categories/category");
var products_1 = require("../../models/products/products");
// router config
var router = express_1.default.Router();
// fetching all products by category
router.get('/category-wise-products', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, productPromises_1, products_2, categoryWiseProducts, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, category_1.Category.find({ isActive: true })];
            case 1:
                categories = _a.sent();
                productPromises_1 = [];
                // fetching products and organizing them by category
                categories.forEach(function (category) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        productPromises_1.push(products_1.Product.find({ 'productCategory.categoryId': category._id }).limit(5));
                        return [2 /*return*/];
                    });
                }); });
                return [4 /*yield*/, Promise.all(productPromises_1)];
            case 2:
                products_2 = _a.sent();
                categoryWiseProducts = categories.map(function (category, index) {
                    return {
                        category: category,
                        productList: products_2[index]
                    };
                });
                res.json({
                    message: 'Products fetched successfully',
                    categoryWiseProducts: categoryWiseProducts
                });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(401).json({
                    message: 'Failed to fetch products',
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// fetch a product by the given id
router.get('/:productId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, product, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                productId = req.params.productId;
                return [4 /*yield*/, products_1.Product.findOne({ _id: productId })];
            case 1:
                product = _a.sent();
                if (product) {
                    res.json({
                        message: 'Product successfully fetched',
                        product: product
                    });
                }
                else {
                    res.status(401).json({
                        message: 'Product not found',
                    });
                }
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(401).json({
                    message: 'Product not found',
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
