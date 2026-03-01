import axios from "axios";
import { db } from "../../db";
import express, { Request, Response } from "express";

const router = express.Router();
const BASE_URL = "http://localhost:2206";

export const instance = axios.create({
  baseURL: BASE_URL,
});

export const setToken = (token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const clearToken = () => {
  delete instance.defaults.headers.common["Authorization"];
}



router.get("/", async (_req: Request, res: Response) => {
  const [rows] = await db.query("SELECT * FROM games");
  if (rows === undefined) {
    return res.status(404).json({ error: "Game not found" });
  }
  res.json(rows);
});

router.get("/:id", async (req: Request, res: Response) => {
  const [rows] = await db.query("SELECT * FROM games WHERE id = ?", [req.params.id]);
  if (rows === undefined) {
    return res.status(404).json({ error: "Game not found" });
  }
  res.json(rows);
});


export default router;
