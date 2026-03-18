import Favorite from "../models/Favorite.js";
import Game from "../models/Game.js";

async function addFavorite(req, res) {
  try {
    const { gameId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const numericGameId = Number(gameId);
    if (Number.isNaN(numericGameId)) {
      return res.status(400).json({ error: "Invalid game id" });
    }

    const game = await Game.findById(numericGameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    try {
      const favorite = await Favorite.create({
        userId,
        gameId: numericGameId,
      });
      return res
        .status(201)
        .json({ message: "Favorite added successfully", favorite });
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(409)
          .json({ error: "Game already in favorites" });
      }
      throw err;
    }
  } catch (error) {
    console.error("addFavorite error:", error);
    return res.status(500).json({ error: "Failed to add favorite" });
  }
}

async function removeFavorite(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const numericGameId = Number(id);
    if (Number.isNaN(numericGameId)) {
      return res.status(400).json({ error: "Invalid game id" });
    }

    const deleted = await Favorite.findOneAndDelete({
      gameId: numericGameId,
      userId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Favorite not found" });
    }

    return res
      .status(200)
      .json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.error("removeFavorite error:", error);
    return res.status(500).json({ error: "Failed to remove favorite" });
  }
}

async function getFavorites(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const favorites = await Favorite.find({ userId })
      .populate("gameId")
      .lean();

    return res.status(200).json(favorites);
  } catch (error) {
    console.error("getFavorites error:", error);
    return res.status(500).json({ error: "Failed to get favorites" });
  }
}

export {
  addFavorite,
  removeFavorite,
  getFavorites
}
