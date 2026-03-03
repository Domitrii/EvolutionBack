import express from "express";
import { addFavorite, removeFavorite, getFavorites } from "../controllers/favorite.js";

const favoriteRouter = express.Router();

favoriteRouter.get("/favorites", getFavorites);
favoriteRouter.post("/favorites/:gameId", addFavorite);
favoriteRouter.delete("/favorites/:id", removeFavorite);

export default favoriteRouter;

