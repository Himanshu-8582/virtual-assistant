import express from "express";
import { Router } from "express";
import { use } from "react";
import { signUp } from "../controllers/auth.controllers.js";


const authRouter = Router();


authRouter.post("/signup", signUp);
authRouter.post("/login", Login);
authRouter.get("/logout", logOut);


export default authRouter;