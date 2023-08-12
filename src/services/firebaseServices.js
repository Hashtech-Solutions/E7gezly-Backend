import firebaseApp from "../firebase.js";
import {getMessaging} from "firebase-admin/messaging";
import {getAuth} from "firebase-admin/auth";

/**
 * Sends a Firebase Cloud Messaging (FCM) message to a specific device token.
 * @param {Object} data - The data payload of the notification, each value must be a string.
 * @param {string} token - The device token of the recipient.
 * @throws {Error} If there was an error sending the message.
 */
export const sendSingleFCM = async (data, token) => {
  const message = {
    data,
    token,
  };
  try {
    await getMessaging(firebaseApp).send(message);
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Sends a Firebase Cloud Messaging (FCM) message to multiple device tokens.
 * @param {Object} data - The data payload of the notification, each value must be a string.
 * @param {string[]} tokens - An array of device tokens of the recipients.
 * @throws {Error} If there was an error sending the message.
 * @returns {string[]} An array of device tokens that failed to receive the message.
 */
export const sendMultipleFCM = async (data, tokens) => {
  const failedTokens = [];
  const message = {
    data,
    tokens,
  };
  try {
    const response = await getMessaging(firebaseApp).sendEachForMulticast(
      message
    );
    if (response.failureCount == tokens.length) {
      throw new Error(
        "All messages failed to send",
        response.responses.map((resp) => resp.error)
      );
    }
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
    }
  } catch (error) {
    throw new Error(error);
  }
  return failedTokens;
};

/**
 * Verifies a Firebase Authentication ID token and returns the decoded token.
 * @param {string} idToken - The Firebase Authentication ID token to verify.
 * @throws {Error} If the ID token could not be verified.
 * @returns {Object} The decoded ID token.
 */
export async function verifyToken(idToken) {
  try {
    const decodedToken = await getAuth(firebaseApp).verifyIdToken(idToken);
    return decodedToken;
  } catch (e) {
    throw e;
  }
}

/**
 * Retrieves a Firebase user by their UID.
 * @param {string} uid - The UID of the user to retrieve.
 * @throws {Error} If the user could not be retrieved.
 * @returns {Object} The retrieved user object.
 */
export async function getUserByUID(uid) {
  try {
    const user = await getAuth(firebaseApp).getUser(uid);
    return user;
  } catch (e) {
    throw e;
  }
}

/**
 * Changes the email address of a Firebase user.
 * @param {string} uid - The UID of the user to update.
 * @param {string} newEmail - The new email address to set for the user.
 * @throws {Error} If the user's email could not be updated.
 */
export async function changeUserEmail(uid, newEmail) {
  try {
    await getAuth(firebaseApp).updateUser(uid, {email: newEmail});
  } catch (e) {
    throw e;
  }
}

/**
 * Creates a new Firebase user account with the given email and password.
 * @param {string} email - The email address to use for the new user account.
 * @param {string} password - The password to use for the new user account.
 * @throws {Error} If the user account could not be created.
 * @returns {Object} The credential object for the newly created user.
 */
export async function signIntoFirebase(email, password) {
  try {
    const credential = await getAuth(firebaseApp).createUser({email, password});
    return credential;
  } catch (e) {
    throw e;
  }
}
