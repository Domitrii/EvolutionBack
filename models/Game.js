import mongoose from "mongoose";

const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    _id: {
      // Use upstream numeric id from the external API
      type: Number,
      required: true,
    },
    title: String,
    thumbnail: String,
    short_description: String,
    genre: String,
    platform: String,
    publisher: String,
    release_date: String,
    price: Number,
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;

