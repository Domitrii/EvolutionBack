import "dotenv/config";
import { db } from "./db";

function generatePrice() {
  const min = 8;
  const max = 29;
  const base = Math.floor(Math.random() * (max - min + 1)) + min;
  const decimals = Math.random() < 0.5 ? 0.99 : 0.49;
  return Number((base + decimals).toFixed(2));
}

export async function syncGames() {
  const response = await fetch(
    "https://www.freetogame.com/api/games?sort-by=popularity"
  );
  const allGames = await response.json();

  const selectedGames = allGames.slice(0, 100);

  for (const game of selectedGames) {
    await db.query(
      `INSERT IGNORE INTO games
       (id, title, thumbnail, short_description, genre, platform, publisher, release_date, price)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        game.id,
        game.title,
        game.thumbnail,
        game.short_description,
        game.genre,
        game.platform,
        game.publisher,
        game.release_date,
        generatePrice(),
      ]
    );
  }

  console.log("✅ 100 games inserted into DB");
}

// Allow running this file directly with: npx ts-node src/SyncGames.ts
if (require.main === module) {
  syncGames()
    .then(() => {
      console.log("✅ Sync finished");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Sync failed", err);
      process.exit(1);
    });
}
