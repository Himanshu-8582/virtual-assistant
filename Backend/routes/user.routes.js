import { Router } from "express";
import multer from "multer";
import { getCurrentUser, updateAssistant } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/mutlet.js";

const userRouter = Router();


userRouter.get("/current",isAuth, getCurrentUser);
userRouter.post("/update",isAuth, upload.single("assistantImage"), updateAssistant);

export default userRouter;