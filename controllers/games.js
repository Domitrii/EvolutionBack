import db from "../db.js"

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

export {getGames, getGameById}