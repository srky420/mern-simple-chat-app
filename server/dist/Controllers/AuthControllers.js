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
exports.Login = exports.Signup = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const createToken_1 = __importDefault(require("../util/createToken"));
const emailValidation_1 = __importDefault(require("../util/emailValidation"));
const bcrypt = require("bcrypt");
// Define signup controller
const Signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get payload data
        const { username, email, password, confirmation } = req.body;
        // Validate payload data
        if (!username || !email || !password || !confirmation) {
            return res.json({ message: "All fields are required." });
        }
        if (!(0, emailValidation_1.default)(email)) {
            return res.json({ message: "Invalid email address." });
        }
        if (password !== confirmation) {
            return res.json({ message: "Passwords do not match." });
        }
        // Check if user already exists
        const existingUser = yield UserModel_1.default.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res.json({
                message: "User already exists with this email or username.",
            });
        }
        // Create new user
        const user = yield UserModel_1.default.create({ username, email, password });
        // Generate jwt token
        const token = (0, createToken_1.default)(user._id);
        // Store token in cookie
        res.cookie("token", token, {
            httpOnly: false,
            sameSite: "none",
        });
        res.status(201).json({
            message: "You have signed up successfully.",
            success: true,
            user,
        });
    }
    catch (e) {
        res.json({
            message: "An error occured during sign up.",
        });
        console.error(e);
    }
});
exports.Signup = Signup;
// Define login controller
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get payload data
        const { email, password } = req.body;
        // Validate email
        if (!(0, emailValidation_1.default)(email)) {
            return res.json({ message: "Invalid email or password." });
        }
        // Check if user exists
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            return res.json({ message: "Invalid email or password." });
        }
        // Compare passwords
        const auth = yield bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: "Invalid email or password" });
        }
        // Generate token
        const token = (0, createToken_1.default)(user._id);
        // Set cookie
        res.cookie("token", token, {
            httpOnly: false,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            message: "You have logged in successfully.",
            success: true,
        });
    }
    catch (e) {
        res.json({
            message: "An error occured during log in.",
        });
        console.error(e);
    }
});
exports.Login = Login;
