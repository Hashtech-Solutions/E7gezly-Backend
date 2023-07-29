import {firebaseApp} from "../index.js";
import {getMessaging} from "firebase-admin/messaging";

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
