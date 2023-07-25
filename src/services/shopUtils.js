import GameSearch from "../models/GameSearch.js";
import dotenv from "dotenv";

dotenv.config();

export const checkDatabaseForGameSearch = async (searchTerm) => {
  const result = await GameSearch.findOne({searchTerm: searchTerm});
  return result;
};

export const checkAPIForGameSearch = async (searchTerm) => {
  const key = process.env.API_KEY;
  const url = `https://api.rawg.io/games?key=${key}&search=${searchTerm}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const saveGameSearchToDatabase = async (gameSearch, shop) => {
  const newGameSearch = new GameSearch(gameSearch);
  await newGameSearch.save();
  shop.gameSearches = shop.gameSearches ? shop.gameSearches + 1 : 1;
  await shop.save();
};
