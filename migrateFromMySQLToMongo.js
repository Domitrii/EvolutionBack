import "dotenv/config";
import mysql from "mysql2/promise";
import mongoose from "mongoose";
import User from "./models/User.js";
import Game from "./models/Game.js";
import Favorite from "./models/Favorite.js";

async function runMigration() {
  // 1. Connect to MySQL
  const mysqlConn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  });

  console.log("✅ Connected to MySQL");

  // 2. Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: true });
  console.log("✅ Connected to MongoDB");

  try {
    await migrateUsers(mysqlConn);
    await migrateGames(mysqlConn);
    await migrateFavorites(mysqlConn);
  } finally {
    await mysqlConn.end();
    await mongoose.disconnect();
  }

  console.log("🎉 Migration finished");
}

// 3. Migrate users
async function migrateUsers(mysqlConn) {
  const [rows] = await mysqlConn.execute(
    "SELECT id, name, email, password_hash, avatar_url, token, refresh_token FROM users"
  );

  console.log(`Migrating ${rows.length} users...`);

  const ops = rows.map((row) => ({
    updateOne: {
      filter: { _id: row.id },             // assuming MySQL user.id is UUID string
      update: {
        $set: {
          name: row.name || "User",
          email: row.email,
          passwordHash: row.password_hash,
          avatarURL: row.avatar_url || null,
          token: row.token || null,
          refreshToken: row.refresh_token || null,
        },
      },
      upsert: true,
    },
  }));

  if (ops.length > 0) {
    await User.bulkWrite(ops);
  }

  console.log("✅ Users migrated");
}

// 4. Migrate games
async function migrateGames(mysqlConn) {
  const [rows] = await mysqlConn.execute("SELECT * FROM games");

  console.log(`Migrating ${rows.length} games...`);

  const ops = rows.map((row) => ({
    updateOne: {
      filter: { _id: row.id },          // numeric id
      update: {
        $set: {
          title: row.title,
          thumbnail: row.thumbnail,
          short_description: row.short_description,
          genre: row.genre,
          platform: row.platform,
          publisher: row.publisher,
          release_date: row.release_date,
          price: row.price,             // if you had a price column
        },
      },
      upsert: true,
    },
  }));

  if (ops.length > 0) {
    await Game.bulkWrite(ops);
  }

  console.log("✅ Games migrated");
}

// 5. Migrate favorites
async function migrateFavorites(mysqlConn) {
  const [rows] = await mysqlConn.execute(
    "SELECT user_id, item_id FROM favorites"
  );

  console.log(`Migrating ${rows.length} favorites...`);

  const ops = rows.map((row) => ({
    updateOne: {
      filter: { userId: row.user_id, gameId: row.item_id },
      update: {
        $setOnInsert: {
          userId: row.user_id,
          gameId: row.item_id,
        },
      },
      upsert: true,
    },
  }));

  if (ops.length > 0) {
    await Favorite.bulkWrite(ops);
  }

  console.log("✅ Favorites migrated");
}

runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});