import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./serves/routes/routes";
import authRouter from "./serves/auth/auth"

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/games", routes);
app.use("/api/users", authRouter)

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
