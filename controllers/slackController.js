const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const slackService = require('../services/slackService');
const githubService = require('../services/githubService');
const chatgptService = require('../services/chatgptService');
const config = require('../config/config');
const { handleError } = require('../utils/errorHandler');

const slackConfigPath = path.resolve(__dirname, '../config/slack-config.yaml');
const slackConfig = yaml.load(fs.readFileSync(slackConfigPath, 'utf8'));

/**
 * Validate the Slack channel ID to ensure the command is coming from an authorized channel.
 * @param {string} channelId - The Slack channel ID to be validated.
 * @returns {Promise<boolean>} - Returns true if the channel is authorized, false otherwise.
 */
async function validateSlackChannel(channelId) {
  if (channelId !== config.slackChannel) {
    logger.warn(`Received Slack command from an unauthorized channel: ${channelId}`);
    return false;
  }
  logger.info(`Received Slack command from authorized channel: ${channelId}`);
  return true;
}

/**
 * Dispatch the Slack command to the appropriate GitHub service function.
 * @param {string} command - The Slack command to be executed.
 * @param {string} text - The text parameter associated with the Slack command.
 * @param {string} responseUrl - The Slack response URL for sending the initial and final responses.
 * @returns {Promise<string>} - The response to be sent back to the Slack app.
 */
async function dispatchSlackCommand(command, text, responseUrl) {
  const slackCommand = slackConfig.slack.commands.find((cmd) => cmd.command === command);

  if (!slackCommand) {
    logger.warn(`Unknown command received: ${command}`);
    return 'Unknown command. Please try again.';
  }

  try {
    logger.info(`Dispatching Slack command: ${command}`);

    // Send the initial response
    await slackService.sendResponse(responseUrl, slackCommand.response.text);

    // Process the command and fetch the data from GitHub or ChatGPT
    let response;
    switch (command) {
      case '/repo-list':
        response = await slackService.getRepoList();
        break;
      case '/repo-details':
        response = await slackService.getRepoDetails(text);
        break;
      case '/user-list':
        response = await slackService.getUserList();
        break;
      case '/user-details':
        response = await slackService.getUserDetails(text);
        break;
      case '/team-list':
        response = await slackService.getTeamList();
        break;
      case '/team-details':
        response = await slackService.getTeamDetails(text);
        break;
      case '/org-details':
        response = await slackService.getOrgDetails();
        break;
      case '/last-commit':
        response = await slackService.getLastCommitDetails(text);
        break;
      case '/ask':
        response = await slackService.askChatGPT(text);
        break;
      default:
        logger.warn('Unknown command. Skipping response.');
        return;
    }

    if (response !== '') {
      logger.info(`Sending final response for command ${command}`);
      // Send the final response
      await slackService.sendResponse(responseUrl, response);
      logger.info(`Final response sent successfully`);
    } else {
      logger.warn('Final response is empty. Skipping response.');
    }
  } catch (error) {
    logger.error(`Error handling Slack command: ${command}`, error);
    await slackService.sendResponse(responseUrl, 'An error occurred while processing the command. Please try again later.');
    handleError(error, 'Error handling Slack command');
    throw error;
  }
}

/**
 * Handle the Slack command and dispatch it to the appropriate GitHub service function.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
async function handleSlackCommand(req, res, next) {
  const { command, text, response_url, channel_id } = req.body;

  logger.info(`Received Slack command: ${command} from channel: ${channel_id}`);

  if (!(await validateSlackChannel(channel_id))) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    await dispatchSlackCommand(command, text, response_url);
    res.status(200).send();
  } catch (error) {
    logger.error(`Error handling Slack command: ${command}`, error);
    await slackService.sendResponse(response_url, 'An error occurred. Please try again later.');
    next(error);
  }
}

module.exports = {
  handleSlackCommand,
};