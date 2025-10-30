import { Router } from "express";
import { signUp, Login, logOut } from "../controllers/auth.controllers.js";


const authRouter = Router();


authRouter.post("/signup", signUp);
authRouter.post("/login", Login);
authRouter.get("/logout", logOut);


export default authRouter;