import express from "express"
import { getGames, getGameById, buyBasket } from "../controllers/games.js";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favorites.js";
import authMiddleware from "../middleware/auth.js";
const gamesRouter = express.Router();

gamesRouter.get("/games", getGames);
gamesRouter.get("/games/:id", getGameById);
gamesRouter.get("/favorites", authMiddleware, getFavorites);
gamesRouter.post("/favorites/:gameId", authMiddleware, addFavorite);
gamesRouter.delete("/favorites/:id", authMiddleware, removeFavorite);
gamesRouter.post("/basket", authMiddleware, buyBasket)

export default gamesRouter;