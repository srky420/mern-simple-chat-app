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
exports.Home = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const Home = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get payload data
    const userId = req.userId;
    // Fetch user doc
    const user = yield UserModel_1.default.findById(userId, '-_id -password');
    if (!user) {
        return res.json({ status: false });
    }
    res.json({ status: true, user });
});
exports.Home = Home;
