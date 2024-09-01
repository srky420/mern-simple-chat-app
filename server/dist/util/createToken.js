"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = require("jsonwebtoken");
(0, dotenv_1.configDotenv)();
const TOKEN_KEY = process.env.TOKEN_KEY;
// Generate jwt token
function createToken(id) {
    return (0, jsonwebtoken_1.sign)({ id }, TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60,
    });
}
exports.default = createToken;
