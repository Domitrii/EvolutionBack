import Game from "../models/Game.js";

async function getGames(req, res) {
  try {
    const games = await Game.find().lean();
    return res.status(200).json(games);
  } catch (error) {
    console.error("getGames error:", error);
    res.status(500).json({ error: "Failed to get games" });
  }
}

async function getGameById(req, res) {
  try {
    const { id } = req.params;
    const numericGameId = Number(id);
    if (Number.isNaN(numericGameId)) {
      return res.status(400).json({ error: "Invalid game id" });
    }

    const game = await Game.findById(numericGameId).lean();
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    return res.status(200).json(game);
  } catch (error) {
    console.error("getGameById error:", error);
    return res.status(500).json({ error: "Failed to get game by id" });
  }
}

export { getGames, getGameById }