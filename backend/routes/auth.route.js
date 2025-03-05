import { Router } from "express";
import {
  handleUserLogIn,
  handleUserSignUp,
  handleUserLogOut,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth.controller.js";
import {
  loginValidation,
  signupValidation,
} from "../middlewares/auth.validation.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signupValidation, handleUserSignUp);
router.post("/login", loginValidation, handleUserLogIn);
router.post("/logout", handleUserLogOut);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;
