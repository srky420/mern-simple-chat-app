"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthControllers_1 = require("../Controllers/AuthControllers");
const AuthMiddleware_1 = require("../Middlewares/AuthMiddleware");
const HomeController_1 = require("../Controllers/HomeController");
// Define auth routes using express router
const authRouter = (0, express_1.Router)();
authRouter.post('/login', AuthControllers_1.Login);
authRouter.post('/signup', AuthControllers_1.Signup);
authRouter.post('/', AuthMiddleware_1.UserVerification, HomeController_1.Home);
exports.default = authRouter;
