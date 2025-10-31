import { Router } from "express";
import { getCurrentUser } from "../controllers/user.controllers.js";


const userRouter = Router();


userRouter.post("/current", getCurrentUser);


export default userRouter;