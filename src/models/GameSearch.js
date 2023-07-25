import mongoose from "mongoose";

export const gameSearchSchema = mongoose.Schema({
  searchTerm: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  // list of games
  games: [],
});

const GameSearch = mongoose.model("GameSearch", gameSearchSchema);

export default GameSearch;
