import GameSearch from "../models/GameSearch.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const checkDatabaseForGameSearch = async (searchTerm) => {
  const result = await GameSearch.findOne({searchTerm: searchTerm});
  return result;
};

export const checkAPIForGameSearch = async (searchTerm) => {
  const key = process.env.API_KEY;
  const url = `https://api.rawg.io/api/games?key=${key}&search=${searchTerm}`;
  const {data} = await axios.get(url);
  return data;
};

export const saveGameSearchToDatabase = async (gameSearch, shop) => {
  const newGameSearch = new GameSearch(gameSearch);
  await newGameSearch.save();
  shop.gameSearches = shop.gameSearches ? shop.gameSearches + 1 : 1;
  await shop.save();
};
