import { db } from "./db";
import express, { Request, Response } from "express";

const router = express.Router();
const BASE_URL = "https://www.freetogame.com/api";

router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await db.query("SELECT * FROM games");
  res.json(rows);
});


export default router;
