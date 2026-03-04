import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/user.js";
import gamesRouter from "./routes/favoriteRoute.js";
import authMiddleware from "./middleware/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", authRouter)
app.use("/api/games", authMiddleware, gamesRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
