const chatgptService = require('../services/chatgptService');
const logger = require('../utils/logger');
const { handleError, InternalServerError } = require('../utils/errorHandler');

/**
 * Handles the '/ask' Slack command and forwards the user's question to ChatGPT.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function handleAskCommand(req, res) {
  const { text, response_url } = req.body;

  try {
    logger.info('Received /ask command from Slack');

    // Send the initial response to Slack
    await chatgptService.sendResponse(response_url, 'Asking ChatGPT...');

    const answer = await chatgptService.askChatGPT(text);

    // Send the final response to Slack
    await chatgptService.sendResponse(response_url, answer);

    res.status(200).send();
  } catch (error) {
    logger.error('Error handling /ask command:', error);

    // Handle different types of errors
    if (error instanceof InternalServerError) {
      // Send an error message to Slack
      await chatgptService.sendResponse(response_url, 'An internal server error occurred. Please try again later.');
    } else {
      // Send a generic error message to Slack
      await chatgptService.sendResponse(response_url, 'An error occurred. Please try again later.');
    }

    handleError(error, 'Error handling /ask command');
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  handleAskCommand,
};