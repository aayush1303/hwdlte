// userRoute.ts
import express from "express";
import { sendOtp, verifyOtp, googleLogin, getMe } from "../controllers/userController";
import authMiddleware from "../middleware/auth";

const userRouter = express.Router();

userRouter.post("/send-otp", sendOtp);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/google", googleLogin);
userRouter.get("/me", authMiddleware, getMe);

export default userRouter;
