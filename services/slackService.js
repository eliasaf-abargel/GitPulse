const axios = require('axios');
const githubService = require('./githubService');
const chatgptService = require('./chatgptService');
const logger = require('../utils/logger');
const config = require('../config/config');
const { handleError } = require('../utils/errorHandler');

/**
 * Send a response to the Slack app.
 * @param {string} responseUrl - The Slack response URL.
 * @param {string | object} response - The response to send, can be a string or an object.
 * @param {string} [responseType] - The type of response (e.g., 'ephemeral', 'in_channel').
 * @returns {Promise<void>}
 */
async function sendResponse(responseUrl, response, responseType = 'in_channel') {
  try {
    let payload;
    if (typeof response === 'string') {
      payload = {
        response_type: responseType,
        text: response,
      };
    } else {
      payload = {
        response_type: responseType,
        ...response,
      };
    }

    await axios.post(responseUrl, payload);
    logger.info(`Response sent successfully`);
  } catch (error) {
    logger.error('Error sending Slack response:', error);
    handleError(error, 'Error sending Slack response');
    throw error;
  }
}

/**
 * Send a message to the Slack app.
 * @param {string} message - The message text to send.
 * @returns {Promise<void>}
 */
async function sendMessage(message) {
  try {
    logger.info(`Sending message to Slack: ${message}`);
    await axios.post('https://slack.com/api/chat.postMessage', {
      token: config.slackBotToken,
      channel: config.slackChannel,
      text: message,
    });
    logger.info(`Message sent successfully`);
  } catch (error) {
    logger.error('Error sending message to Slack:', error);
    handleError(error, 'Error sending message to Slack');
    throw error;
  }
}

/**
 * Get the list of repositories in the organization.
 * @returns {Promise<string>} The formatted repository list.
 */
async function getRepoList() {
  try {
    const repositories = await githubService.getOrganizationRepositories();
    const repoList = repositories.map((repo) => `• ${repo.name} (${repo.private ? 'Private' : 'Public'})`).join('\n');
    const response = `Repositories in the organization:\n\n${repoList}`;
    logger.info('Fetched repository list successfully');
    return response;
  } catch (error) {
    logger.error('Error fetching repository list:', error);
    handleError(error, 'Error fetching repository list');
    throw error;
  }
}

/**
 * Get the details of a specific repository.
 * @param {string} repoName - The name of the repository.
 * @returns {Promise<string>} The formatted repository details.
 */
async function getRepoDetails(repoName) {
  try {
    const repoDetails = await githubService.getRepositoryDetails(repoName);
    const response = `Repository Details for ${repoName}:\n\n` +
      `Name: ${repoDetails.name}\n` +
      `Description: ${repoDetails.description || 'No description provided'}\n` +
      `Private: ${repoDetails.private}\n` +
      `URL: ${repoDetails.url}\n` +
      `Created At: ${repoDetails.createdAt}\n` +
      `Updated At: ${repoDetails.updatedAt}\n` +
      `Contributors: ${repoDetails.contributors.join(', ')}\n` +
      `Languages: ${repoDetails.languages.join(', ')}\n` +
      `Teams: ${repoDetails.teams.join(', ')}`;
    logger.info(`Fetched details for repository: ${repoName}`);
    return response;
  } catch (error) {
    logger.error(`Error fetching details for repository: ${repoName}`, error);
    handleError(error, `Error fetching details for repository: ${repoName}`);
    throw error;
  }
}

/**
 * Get the list of members in the organization.
 * @returns {Promise<string>} The formatted member list.
 */
async function getUserList() {
  try {
    const members = await githubService.getOrganizationMembers();
    const userList = members.map((member) => `• ${member.login}`).join('\n');
    const response = `Users in the organization:\n\n${userList}`;
    logger.info('Fetched user list successfully');
    return response;
  } catch (error) {
    logger.error('Error fetching user list:', error);
    handleError(error, 'Error fetching user list');
    throw error;
  }
}

/**
 * Get the details of a specific user.
 * @param {string} username - The username of the user.
 * @returns {Promise<string>} The formatted user details.
 */
async function getUserDetails(username) {
  try {
    const userDetails = await githubService.getUserDetails(username);
    const response = `User Details for ${username}:\n\n` +
      `Login: ${userDetails.login}\n` +
      `Name: ${userDetails.name || 'No name provided'}\n` +
      `Email: ${userDetails.email || 'No email provided'}\n` +
      `Location: ${userDetails.location || 'No location provided'}\n` +
      `Bio: ${userDetails.bio || 'No bio provided'}\n` +
      `Public Repos: ${userDetails.publicRepos}\n` +
      `Followers: ${userDetails.followers}\n` +
      `Following: ${userDetails.following}\n` +
      `Created At: ${userDetails.createdAt}\n` +
      `Updated At: ${userDetails.updatedAt}\n` +
      `Repositories: ${userDetails.repositories.map(repo => `\n• ${repo}`).join(', ') || 'No repositories'}\n` +
      `Organizations: ${userDetails.organizations.map(org => `\n• ${org}`).join(', ') || 'No organizations'}`;
    logger.info(`Fetched details for user: ${username}`);
    return response;
  } catch (error) {
    logger.error(`Error fetching details for user: ${username}`, error);
    handleError(error, `Error fetching details for user: ${username}`);
    throw error;
  }
}

/**
 * Get the list of teams in the organization.
 * @returns {Promise<string>} The formatted team list.
 */
async function getTeamList() {
  try {
    const teams = await githubService.getOrganizationTeams();
    const teamList = teams.map((team) => `• ${team.name}`).join('\n');
    const response = `Teams in the organization:\n\n${teamList}`;
    logger.info('Fetched team list successfully');
    return response;
  } catch (error) {
    logger.error('Error fetching team list:', error);
    handleError(error, 'Error fetching team list');
    throw error;
  }
}

/**
 * Get the details of a specific team.
 * @param {string} teamName - The name of the team.
 * @returns {Promise<string>} The formatted team details.
 */
async function getTeamDetails(teamName) {
  try {
    const teamDetails = await githubService.getTeamDetails(teamName);
    const membersFormatted = teamDetails.members.map(member => `• ${member.login}`).join('\n');
    const reposFormatted = teamDetails.repositories
      ? teamDetails.repositories.map(repo => `• ${repo.name}`).join('\n')
      : 'No repositories associated';

    const response = `
Team Details for ${teamName}:

Name: ${teamDetails.name}
Description: ${teamDetails.description || 'No description provided'}
Privacy: ${teamDetails.privacy}
Permission: ${teamDetails.permission}

Members:
${membersFormatted}

Repositories:
${reposFormatted}
`;

    logger.info(`Fetched details for team: ${teamName}`);
    return response;
  } catch (error) {
    logger.error(`Error fetching details for team: ${teamName}`, error);
    handleError(error, `Error fetching details for team: ${teamName}`);
    throw error;
  }
}

/**
 * Get the details of the organization.
 * @returns {Promise<string>} The formatted organization details.
 */
async function getOrgDetails() {
  try {
    const orgDetails = await githubService.getOrganizationDetails();
    const response = `Organization Details:\n\n` +
      `Login: ${orgDetails.login}\n` +
      `Name: ${orgDetails.name}\n` +
      `Description: ${orgDetails.description || 'No description provided'}\n` +
      `Blog: ${orgDetails.blog || 'No blog provided'}\n` +
      `Location: ${orgDetails.location || 'No location provided'}\n` +
      `Email: ${orgDetails.email || 'No email provided'}\n` +
      `Public Repos: ${orgDetails.public_repos}\n` +
      `Public Gists: ${orgDetails.public_gists}\n` +
      `Followers: ${orgDetails.followers}\n` +
      `Following: ${orgDetails.following}\n` +
      `Created At: ${orgDetails.created_at}\n` +
      `Updated At: ${orgDetails.updated_at}`;
    logger.info('Fetched organization details successfully');
    return response;
  } catch (error) {
    logger.error('Error fetching organization details:', error);
    handleError(error, 'Error fetching organization details');
    throw error;
  }
}

/**
 * Get the last commit details for a specific repository.
 * @param {string} repoName - The name of the repository.
 * @returns {Promise<string>} The formatted last commit details.
 */
async function getLastCommitDetails(repoName) {
  try {
    const lastCommitDetails = await githubService.getLastCommitDetails(repoName);
    const response = `Last Commit Details for ${repoName}:\n\n` +
      `SHA: ${lastCommitDetails.sha}\n` +
      `Author: ${lastCommitDetails.author}\n` +
      `Message: ${lastCommitDetails.message}\n` +
      `Date: ${lastCommitDetails.date}`;
    logger.info(`Fetched last commit details for repository: ${repoName}`);
    return response;
  } catch (error) {
    logger.error(`Error fetching last commit details for repository: ${repoName}`, error);
    handleError(error, `Error fetching last commit details for repository: ${repoName}`);
    throw error;
  }
}

/**
 * Sends a question to ChatGPT and receives an answer.
 * @param {string} question - The question to ask ChatGPT.
 * @returns {Promise<string>} - The answer from ChatGPT.
 */
async function askChatGPT(question) {
  try {
    const answer = await chatgptService.generateChatGPTResponse(question);
    return answer;
  } catch (error) {
    if (error instanceof InternalServerError) {
      logger.error('Internal server error occurred while asking ChatGPT:', error);
      throw error;
    } else {
      logger.error('Error asking ChatGPT:', error);
      throw new InternalServerError('Failed to generate response');
    }
  }
}

module.exports = {
  sendResponse,
  sendMessage,
  getRepoList,
  getRepoDetails,
  getUserList,
  getUserDetails,
  getTeamList,
  getTeamDetails,
  getOrgDetails,
  getLastCommitDetails,
  askChatGPT,
};