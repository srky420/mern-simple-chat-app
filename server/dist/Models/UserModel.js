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
const mongoose_1 = require("mongoose");
const saveAvatar_1 = __importDefault(require("../util/saveAvatar"));
const bcrypt = require("bcrypt");
// Define User schema
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    createdtime: {
        type: Date,
        default: Date.now(),
    },
});
// Pre-save password hash
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt.hash(this.password, 12);
        this.avatar = yield (0, saveAvatar_1.default)(this.username);
    });
});
// Define User model
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
