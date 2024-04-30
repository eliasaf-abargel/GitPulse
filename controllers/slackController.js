const logger = require('../utils/logger');
const slackService = require('../services/slackService');
const githubController = require('./githubController');

/**
 * Validate the Slack channel ID to ensure the command is coming from an authorized channel.
 * @param {string} channelId - The Slack channel ID to be validated.
 * @returns {Promise<boolean>} - Returns true if the channel is authorized, false otherwise.
 */
async function validateSlackChannel(channelId) {
  if (channelId !== process.env.SLACK_CHANNEL) {
    logger.warn(`Received Slack command from an unauthorized channel: ${channelId}`);
    return false;
  }
  return true;
}

/**
 * Dispatch the Slack command to the appropriate GitHub controller function.
 * @param {string} command - The Slack command to be executed.
 * @param {string} text - The text parameter associated with the Slack command.
 * @returns {Promise<string>} - The response to be sent back to the Slack app.
 */
async function dispatchSlackCommand(command, text) {
  let response;
  switch (command) {
    case '/repo-list':
      response = await githubController.getOrganizationRepositories();
      break;
    case '/repo-details':
      response = await githubController.getRepositoryDetails(text);
      break;
    case '/user-list':
      response = await githubController.getOrganizationMembers();
      break;
    case '/user-details':
      response = await githubController.getUserDetails(text);
      break;
    case '/team-list':
      response = await githubController.getOrganizationTeams();
      break;
    case '/team-details':
      response = await githubController.getTeamDetails(text);
      break;
    case '/org-details':
      response = await githubController.getOrganizationDetails();
      break;
    default:
      response = 'Unknown command. Please try again.';
  }
  return response;
}

/**
 * Handle the Slack command and dispatch it to the appropriate GitHub controller function.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function handleSlackCommand(req, res) {
  const { command, text, response_url, channel_id } = req.body;

  if (!(await validateSlackChannel(channel_id))) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const response = await dispatchSlackCommand(command, text);
    await slackService.sendResponse(response_url, response);
    res.send('');
  } catch (error) {
    logger.error('Error handling Slack command:', error);
    await slackService.sendResponse(response_url, 'An error occurred while processing the command. Please try again later.');
    res.status(500).send('');
  }
}

module.exports = {
  handleSlackCommand,
};