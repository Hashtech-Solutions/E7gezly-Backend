import User from "../models/User.js";
import * as firebaseServices from "./firebaseServices.js";
export const createUser = async (user) => {
  try {
    const newUser = new User(user);
    const createdUser = await newUser.save();
    return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserByUserName = async (userName) => {
  try {
    const user = await User.findOne({ userName });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUser = async (id, user) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Adds a new FCM token to the user's list of tokens, if it doesn't already exist.
 * @param {string} id - The ID of the user to add the token to.
 * @param {string} token - The FCM token to add.
 * @returns {Promise<User>} - A promise that resolves with the updated user object.
 * @throws {Error} - If there was an error adding the token to the user object.
 */
export const addFCMToken = async (id, token) => {
  try {
    const user = await User.findById(id);
    if (user.fcmTokens === undefined) user.fcmTokens = [];
    if (!user.fcmTokens.includes(token)) {
      user.fcmTokens.push(token);
      await user.save();
    }
    return user;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

/**
 * Removes a specific FCM token from the user's list of tokens.
 * @param {string} id - The ID of the user to remove the token from.
 * @param {string} token - The FCM token to remove.
 * @returns {Promise<User>} - A promise that resolves with the updated user object.
 * @throws {Error} - If there was an error removing the token from the user object.
 */
export const removeFCMToken = async (id, token) => {
  try {
    const user = await User.findById(id);
    if (user.fcmTokens === undefined) user.fcmTokens = [];
    user.fcmTokens = user.fcmTokens.filter((t) => t !== token);
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Removes multiple FCM tokens from the user's list of tokens.
 * @param {string} id - The ID of the user to remove the tokens from.
 * @param {string[]} tokens - An array of FCM tokens to remove.
 * @returns {Promise<User>} - A promise that resolves with the updated user object.
 * @throws {Error} - If there was an error removing the tokens from the user object.
 */
export const removeMultipleFCMTokens = async (id, tokens) => {
  try {
    const user = await User.findById(id);
    if (user.fcmTokens === undefined) user.fcmTokens = [];
    user.fcmTokens = user.fcmTokens.filter((t) => !tokens.includes(t));
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Updates a specific FCM token for the user.
 * @param {string} id - The ID of the user to update the token for.
 * @param {string} oldToken - The old FCM token to replace.
 * @param {string} newToken - The new FCM token to replace the old one with.
 * @returns {Promise<User>} - A promise that resolves with the updated user object.
 * @throws {Error} - If there was an error updating the token for the user object.
 */
export const updateFCMToken = async (id, oldToken, newToken) => {
  try {
    const user = await User.findById(id);
    if (user.fcmTokens === undefined) user.fcmTokens = [];
    user.fcmTokens = user.fcmTokens.map((t) => (t === oldToken ? newToken : t));
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Sends a notification to a user's FCM tokens.
 * @param {string} id - The ID of the user to send the notification to.
 * @param {Object} data - The data to send with the notification, each value must be a string
 * @returns {Promise<void>} - A promise that resolves when the notification has been sent, or returns if the user has no FCM tokens.
 * @throws {Error} - If there was an error sending the notification.
 */
export const sendNotification = async (id, data) => {
  try {
    const user = await User.findById(id);
    const tokens = user.fcmTokens;
    if (tokens === undefined || tokens.length === 0) return;
    const failedTokens = await firebaseServices.sendMultipleFCM(data, tokens);
    if (failedTokens.length > 0) {
      await removeMultipleFCMTokens(id, failedTokens);
    }
  } catch (error) {
    throw new Error(error);
  }
};
