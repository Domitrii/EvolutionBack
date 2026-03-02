// import { db } from "../db";
// import express, { Request, Response } from "express";

// const router = express.Router();

// router.get("/", async (_req: Request, res: Response) => {
//   const [rows] = await db.query("SELECT * FROM games");
//   if (rows === undefined) {
//     return res.status(404).json({ error: "Game not found" });
//   }
//   res.json(rows);
// });

// router.get("/:id", async (req: Request, res: Response) => {
//   const [rows] = await db.query("SELECT * FROM games WHERE id = ?", [req.params.id]);
//   if (rows === undefined) {
//     return res.status(404).json({ error: "Game not found" });
//   }
//   res.json(rows);
// });


// export default router;


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