import "dotenv/config";
import mongoose from "./db.js";
import Game from "./models/Game.js";

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
    await Game.updateOne(
      { _id: game.id },
      {
        title: game.title,
        thumbnail: game.thumbnail,
        short_description: game.short_description,
        genre: game.genre,
        platform: game.platform,
        publisher: game.publisher,
        release_date: game.release_date,
        price: generatePrice(),
      },
      { upsert: true }
    );
  }

  console.log("✅ 100 games inserted into MongoDB");
}

// Allow running this file directly with: node SyncGames.js
if (import.meta.url === `file://${process.argv[1]}`) {
  syncGames()
    .then(() => {
      console.log("✅ Sync finished");
      return mongoose.disconnect();
    })
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Sync failed", err);
      mongoose.disconnect().finally(() => process.exit(1));
    });
}
