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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserVerification = void 0;
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = require("jsonwebtoken");
(0, dotenv_1.configDotenv)();
const TOKEN_KEY = process.env.TOKEN_KEY;
// Verify jwt token from cookie
const UserVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get token from cookie
    const token = req.cookies.token;
    // If token does not exist
    if (!token) {
        return res.json({ status: false });
    }
    // Verify token
    (0, jsonwebtoken_1.verify)(token, TOKEN_KEY, (err, data) => {
        if (err) {
            return res.json({ status: false });
        }
        req.userId = data.id;
        next();
    });
});
exports.UserVerification = UserVerification;
