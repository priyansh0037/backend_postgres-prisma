import { Router } from "express";
import { authController, login } from "../controllers/AuthController.js";
import { profileController, profileUpdate } from "../controllers/ProfileController.js";
import { authMiddleware } from "../Middleware/authenticat.js";

const router = Router();

router.post("/auth/register", authController )
router.post("/auth/login", login )

// profile routes
router.get("/profile",authMiddleware,profileController) //private route of profile

router.put("/profile/:id",authMiddleware,profileUpdate) //private route of profile


export default router ;