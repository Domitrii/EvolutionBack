import Game from "../models/Game.js";
import { purchaseSchema } from "../schemas/authSchema.js";

async function getGames(req, res) {
  try {
    const games = await Game.find().lean();
    return res.status(200).json(games);
  } catch (error) {
    console.error("getGames error:", error);
    res.status(500).json({ error: "Failed to get games" });
  }
}

const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Looking for game with id:", id) // ← add this

    const game = await Game.findById(id).lean();
    console.log("Found game:", game) // ← and this
    
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    return res.status(200).json(game);
  } catch (error) {
    console.error("getGameById error:", error);
    return res.status(500).json({ error: "Failed to get game by id" });
  }
}

async function buyBasket(req, res) {
  try{
    console.log(req)
    const {error} = purchaseSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return req
  } catch (error) {
    console.error(error)
  }
}

export { getGames, getGameById, buyBasket }