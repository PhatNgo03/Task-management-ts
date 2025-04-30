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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.login = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generate_1 = require("../../../helpers/generate");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.password = (0, md5_1.default)(req.body.password);
        req.body.tokenUser = (0, generate_1.generateRandomString)(30);
        const existEmail = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: { $ne: true }
        });
        if (existEmail) {
            res.status(400).json({ code: 400, message: "Tài khoản đã tồn tại" });
            return;
        }
        else {
            const user = new user_model_1.default({
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password,
                tokenUser: req.body.tokenUser
            });
            yield user.save();
            const token = user.tokenUser;
            res.cookie("token", token);
            res.json({
                code: 200,
                message: "Tạo tài khoản thành công!",
                token: token
            });
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi đăng kí tài khoản"
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = yield user_model_1.default.findOne({
            email: email,
            deleted: { $ne: true }
        });
        if (!user) {
            res.json({
                code: 400,
                message: "Email không tồn tại!"
            });
            return;
        }
        if ((0, md5_1.default)(password) != user.password) {
            res.json({
                code: 400,
                mesage: "Sai mật khẩu!"
            });
        }
        const tokenUser = user.tokenUser;
        res.cookie("token", tokenUser);
        res.json({
            code: 200,
            message: "Đăng nhập thành công!"
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi đăng nhập tài khoản!"
        });
    }
});
exports.login = login;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        res.json({
            code: 200,
            message: "Lấy ra thông tin user thành công!",
            infoUser: user
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        });
    }
});
exports.detail = detail;
