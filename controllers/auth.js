import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { registerSchema, loginSchema, updateSchema } from "../schemas/authSchema.js";
import User from "../models/User.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;

function toUser(doc) {
  if (!doc) return null;
  return { id: doc._id, email: doc.email, name: doc.name };
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET_REFRESH, { expiresIn: "7d" });
}

async function register(req, res) {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { name, email, password, repeatPassword } = req.body;

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    if (password !== repeatPassword) {
      return res
        .status(400)
        .json({ error: "Passwords do not match" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4().toString();

    const token = signToken({ userId });
    const refreshToken = signRefreshToken({ userId });

    const userDoc = await User.create({
      _id: userId,
      name: name ?? "User",
      email,
      passwordHash,
      token,
      refreshToken,
    });

    const user = toUser(userDoc);

    return res.status(201).json({ user, token, refreshToken });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
}

async function login(req, res) {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      return res
        .status(401)
        .json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(
      password,
      userDoc.passwordHash
    );
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Invalid email or password" });
    }

    const token = signToken({ userId: userDoc._id });
    const refreshToken = signRefreshToken({ userId: userDoc._id });

    userDoc.token = token;
    userDoc.refreshToken = refreshToken;
    await userDoc.save();

    const user = toUser(userDoc);

    return res.json({ user, token, refreshToken });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
}

async function me(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(toUser(userDoc));
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ error: "Failed to get user" });
  }
}

async function logout(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    userDoc.token = null;
    userDoc.refreshToken = null;
    await userDoc.save();

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ error: "Failed to logout" });
  }
}

export { register, login, me, logout };
