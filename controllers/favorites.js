import db from "../db.js"
import { v4 as uuidv4 } from "uuid";

async function addFavorite(req, res) {
    console.log(req)
    try {
        const { gameId } = req.params;
        const userId = req.userId;

        const data = await db.query("INSERT INTO favorites (id, user_id, item_id) VALUES (?,?,?)", [ uuidv4(), userId, gameId])
        if (!data) {
            return res.status(400).json({ error: "Failed to add favorite, no id found" });
        }
        return res.status(200).json({ message: "Favorite added successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Failed to add favorite" });
    }
}

async function removeFavorite(req, res) {
    try {
        const {id} = req.params
        console.log(id)
        const data = await db.query("DELETE FROM favorites WHERE id = ?", [id])
        if (!data) {
            return res.status(400).json({error: "Failed to remove favorite"})
        }
        return res.status(200).json({message: "Favorite removed successfully"})
    } catch (error) {
        return res.status(500).json({ error: "Failed to remove favorite" });
    }
}

async function getFavorites(req, res) {
    try {
        const userId = req.userId
        const data = await db.query("SELECT * FROM favorites WHERE user_id = ?", [userId])
        if (!data) {
            return res.status(400).json({error: "Failed to get favorites"})
        }
        return res.status(200).json({data}.data[0])
    } catch (error) {
        return res.status(500).json({ error: "Failed to get favorites" });
    }
}

async function getGames(req, res) {
    try {
        const data = await db.query("SELECT * FROM games")
        if (!data) {
            return res.status(400).json({error: "Failed to get games"})
        }
        return res.status(200).json({data}.data[0])
    } catch (error) {
        res.status(500).json({error: "Failed to get games"})
    }
}

async function getGameById(req, res) {
    try {
        const {id} = req.params
        const data = await db.query("SELECT * FROM games WHERE id = ?", [id])
        if (!data) {
            return res.status(400).json({error: "Failed to get game by id"})
        }
        return res.status(200).json({data: {data}.data[0]})
    } catch (error) {
        return res.status(500).json({error: "Failed to get game by id"})
    }
}

export { addFavorite, removeFavorite, getFavorites, getGames, getGameById }

