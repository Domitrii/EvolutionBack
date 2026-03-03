import express from "express";
import { register, login, me, logout } from "../controllers/auth.js";
const router = express.Router();
import authMiddleware from "../middleware/auth.js";

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/logout", logout);
// router.get("/users", getUsers);
// router.get("/users/:id", getUserById);
// router.put("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);


export default router;