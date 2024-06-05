import { Router } from "express";
import { Login, Signup } from "../Controllers/AuthControllers";
import { UserVerification } from "../Middlewares/AuthMiddleware";
import { Home } from "../Controllers/HomeController";

// Define auth routes using express router
const authRouter = Router();

authRouter.post('/login', Login);
authRouter.post('/signup', Signup);
authRouter.post('/', UserVerification, Home);

export default authRouter;
