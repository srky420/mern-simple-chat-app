import { Router } from "express";
import { Login, Signup } from "../Controllers/AuthControllers";
import { UserVerification } from "../Middlewares/AuthMiddleware";
import { Home } from "../Controllers/HomeController";

// Define auth routes using express router
const router = Router();

router.post('/login', Login);
router.post('/signup', Signup);
router.post('/', UserVerification, Home);

export default router;
