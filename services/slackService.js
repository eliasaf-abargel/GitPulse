// services/slackService.js

const axios = require('axios');
const githubService = require('./githubService');
const logger = require('../utils/logger');
const config = require('../config/config');

async function sendResponse(responseUrl, response) {
  try {
    await axios.post(responseUrl, { text: response });
  } catch (error) {
    logger.error('Error sending Slack response:', error);
    throw error;
  }
}

async function sendMessage(message) {
  try {
    await axios.post('https://slack.com/api/chat.postMessage', {
      token: config.slackBotToken,
      channel: config.slackChannel,
      text: message,
    });
  } catch (error) {
    logger.error('Error sending message to Slack:', error);
    throw error;
  }
}

async function getRepoList() {
  try {
    const repositories = await githubService.getOrganizationRepositories();
    const repoList = repositories.map((repo) => `${repo.name} (${repo.private ? 'Private' : 'Public'})`).join('\n');
    return `Repositories in the organization:\n${repoList}`;
  } catch (error) {
    logger.error('Error fetching repository list:', error);
    throw error;
  }
}

async function getRepoDetails(repoName) {
  try {
    const repoDetails = await githubService.getRepositoryDetails(repoName);
    return `Repository Details for ${repoName}:\n` +
      `Name: ${repoDetails.name}\n` +
      `Description: ${repoDetails.description}\n` +
      `Private: ${repoDetails.private}\n` +
      `URL: ${repoDetails.url}\n` +
      `Created At: ${repoDetails.createdAt}\n` +
      `Updated At: ${repoDetails.updatedAt}\n` +
      `Contributors: ${repoDetails.contributors.join(', ')}\n` +
      `Languages: ${repoDetails.languages.join(', ')}`;
  } catch (error) {
    logger.error(`Error fetching details for repository: ${repoName}`, error);
    throw error;
  }
}

async function getUserList() {
  try {
    const members = await githubService.getOrganizationMembers();
    const userList = members.map((member) => member.login).join('\n');
    return `Users in the organization:\n${userList}`;
  } catch (error) {
    logger.error('Error fetching user list:', error);
    throw error;
  }
}

async function getUserDetails(username) {
  try {
    const userDetails = await githubService.getUserDetails(username);
    return `User Details for ${username}:\n` +
      `Login: ${userDetails.login}\n` +
      `Name: ${userDetails.name}\n` +
      `Email: ${userDetails.email}\n` +
      `Location: ${userDetails.location}\n` +
      `Bio: ${userDetails.bio}\n` +
      `Public Repos: ${userDetails.publicRepos}\n` +
      `Followers: ${userDetails.followers}\n` +
      `Following: ${userDetails.following}\n` +
      `Created At: ${userDetails.createdAt}\n` +
      `Updated At: ${userDetails.updatedAt}\n` +
      `Repositories: ${userDetails.repositories.join(', ')}\n` +
      `Organizations: ${userDetails.organizations.join(', ')}`;
  } catch (error) {
    logger.error(`Error fetching details for user: ${username}`, error);
    throw error;
  }
}

async function getTeamList() {
  try {
    const teams = await githubService.getOrganizationTeams();
    const teamList = teams.map((team) => team.name).join('\n');
    return `Teams in the organization:\n${teamList}`;
  } catch (error) {
    logger.error('Error fetching team list:', error);
    throw error;
  }
}

async function getTeamDetails(teamName) {
  try {
    const teamDetails = await githubService.getTeamDetails(teamName);
    return `Team Details for ${teamName}:\n` +
      `Name: ${teamDetails.name}\n` +
      `Description: ${teamDetails.description}\n` +
      `Privacy: ${teamDetails.privacy}\n` +
      `Permission: ${teamDetails.permission}\n` +
      `Members: ${teamDetails.members.join(', ')}\n` +
      `Repositories: ${teamDetails.repositories.join(', ')}`;
  } catch (error) {
    logger.error(`Error fetching details for team: ${teamName}`, error);
    throw error;
  }
}

async function getOrgDetails() {
  try {
    const orgDetails = await githubService.getOrganizationDetails();
    return `Organization Details:\n` +
      `Login: ${orgDetails.login}\n` +
      `Name: ${orgDetails.name}\n` +
      `Description: ${orgDetails.description}\n` +
      `Blog: ${orgDetails.blog}\n` +
      `Location: ${orgDetails.location}\n` +
      `Email: ${orgDetails.email}\n` +
      `Public Repos: ${orgDetails.publicRepos}\n` +
      `Public Gists: ${orgDetails.publicGists}\n` +
      `Followers: ${orgDetails.followers}\n` +
      `Following: ${orgDetails.following}\n` +
      `Created At: ${orgDetails.createdAt}\n` +
      `Updated At: ${orgDetails.updatedAt}\n` +
      `Members: ${orgDetails.members.length}\n` +
      `Teams: ${orgDetails.teams.length}\n` +
      `Repositories: ${orgDetails.repositories.length}`;
  } catch (error) {
    logger.error('Error fetching organization details:', error);
    throw error;
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
};