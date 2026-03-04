import express from "express";
import { addFavorite, removeFavorite, getFavorites, getGames, getGameById } from "../controllers/favorites.js";

const gamesRouter = express.Router();

gamesRouter.get("/favorites", getFavorites);
gamesRouter.post("/favorites/:gameId", addFavorite);
gamesRouter.delete("/favorites/:id", removeFavorite);

export default gamesRouter;

