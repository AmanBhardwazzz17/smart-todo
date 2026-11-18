import {Router} from 'express';
import {registerUser, loginUser, getCurrentUser,logoutUser} from '../controllers/user.controller.js';
import { verifyjwt } from "../middlewares/auth.middleware.js";


const router = Router();


router.post('/register',registerUser);
router.post('/login',loginUser);
router.route("/me").get(verifyjwt,getCurrentUser);
router.route("/logout").post(verifyjwt, logoutUser);


export default router;