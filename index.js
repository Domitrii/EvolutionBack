import "dotenv/config";
import { connectPromise } from "./db.js";
import express from "express";
import cors from "cors";
import authRouter from "./routes/user.js";
// import favoriteRouter from "./routes/favoriteRoute.js";
// import authMiddleware from "./middleware/auth.js";
import gamesRouter from "./routes/gamesRoute.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", authRouter);
app.use("/api/games", gamesRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

connectPromise.then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
