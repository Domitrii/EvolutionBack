import bcrypt from "bcrypt";
import db from "../db.js";
import jwt from "jsonwebtoken";
import {registerSchema, loginSchema, updateSchema} from "../schemas/authSchema.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

function toUser(row) {
    return { id: row.id, email: row.email, name: row.name };
  }

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
  }

function signRefreshToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }
  

async function register (req, res){
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      const { name, email, password, repeatPassword } = req.body;

      const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
      if (Array.isArray(existing) && existing.length > 0) {
        return res.status(409).json({ error: "Email already registered" });
      }

      if (password !== repeatPassword) return res.status(400).json({error: "Passwords do not match"});

      const password_hash = await bcrypt.hash(password, 10);
      const userId = uuidv4().toString();
      await db.query(
        "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
        [userId, name ?? null, email, password_hash]
      );

      const token = signToken({ userId });
      const refreshToken = signRefreshToken({ userId });

      await db.query("UPDATE users SET token = ?, refresh_token = ? WHERE id = ?", [token, refreshToken, userId]);

      const user = { id: userId, email, name: name ?? null };

    //   res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 });
    //   res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 15 * 60 * 1000 });
      return res.status(201).json({ user, token, refreshToken });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ error: "Registration failed" });
    }
  }
  
async function login (req, res) {
    try {
        const {error} = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({error: error.message})
        }        
        const { email, password } = req.body;
        const [rows] = await db.query(
            "SELECT id, email, name, password_hash FROM users WHERE email = ?",
            [email]
        );
        const userRow = Array.isArray(rows) ? rows[0] : null;
        if (!userRow || !(await bcrypt.compare(password, userRow.password_hash))) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const user = { id: userRow.id, email: userRow.email, name: userRow.name };

        
        const token = signToken({userId: userRow.id});


        const refreshToken = signRefreshToken({ userId: userRow.id });


        const result = await db.query("UPDATE users SET token = ?, refresh_token = ? WHERE id = ?", [token, refreshToken, userRow.id]);
        // res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 });
        // res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 15 * 60 * 1000 });
        res.json({ user, token, refreshToken, result });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Login failed" });
    }
}

async function me (req, res) {
    try {
        const userId = req.userId;
        const [rows] = await db.query("SELECT id, email, name FROM users WHERE id = ?", [userId]);
        const userRow = Array.isArray(rows) ? rows[0] : null;
        return res.json(toUser(userRow));
    } catch (err) {
        console.error("Me error:", err);
        return res.status(500).json({ error: "Failed to get user" });
    }
}

async function logout (req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const result = Array.isArray(await db.query("UPDATE users SET token = NULL, refresh_token = NULL WHERE id = ?", [userId])) ? result[0] : null;
        if (!result) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        return res.json({ message: "Logged out successfully", result });
    } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Failed to logout" });
  }
}

export { register, login, me, logout };

