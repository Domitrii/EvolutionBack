import express from "express"
import { getGames, getGameById } from "../controllers/games";
const gamesRouter = express.Router();


gamesRouter.get("/games", getGames);
gamesRouter.get("/games/:id", getGameById);

export default gamesRouter;