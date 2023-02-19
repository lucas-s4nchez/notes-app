import {
  deleteUser,
  loginUser,
  registerUser,
  revalidateToken,
} from "../controllers/auth";
import { Router } from "express";
import { validateLogin, validateRegister } from "../validators/auth";
import jwtValidator from "../middlewares/jwtValidator";
const router = Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.delete("/:id", jwtValidator, deleteUser);
router.get("/renew", jwtValidator, revalidateToken);

export default router;
