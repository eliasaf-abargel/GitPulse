// server/src/services/githubService.js
const axios = require('axios');
const config = require('../config/config');

const getUserAnalytics = async () => {
  // Implement the logic to fetch user analytics data from GitHub API
  // and process the data as needed
};

module.exports = {
  getUserAnalytics,
};

const getGitHubData = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${config.githubToken}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

const getOrganizationData = async () => {
  const orgUrl = `https://api.github.com/orgs/${config.organizationName}`;
  return await getGitHubData(orgUrl);
};

const getOrganizationMembers = async () => {
  const membersUrl = `https://api.github.com/orgs/${config.organizationName}/members`;
  return await getGitHubData(membersUrl);
};

const getOrganizationRepositories = async () => {
  const reposUrl = `https://api.github.com/orgs/${config.organizationName}/repos`;
  return await getGitHubData(reposUrl);
};

const getOrganizationTeams = async () => {
  const teamsUrl = `https://api.github.com/orgs/${config.organizationName}/teams`;
  return await getGitHubData(teamsUrl);
};

const getTeamMembers = async (teamSlug) => {
  const teamsUrl = `https://api.github.com/orgs/${config.organizationName}/teams`;
  const teams = await getGitHubData(teamsUrl);
  const team = teams.find((team) => team.slug === teamSlug);
  if (!team) {
    throw new Error(`Team "${teamSlug}" not found in organization "${config.organizationName}"`);
  }
  const membersUrl = `https://api.github.com/teams/${team.id}/members`;
  return await getGitHubData(membersUrl);
};

const getTeamRepositories = async (teamSlug) => {
  const teamsUrl = `https://api.github.com/orgs/${config.organizationName}/teams`;
  const teams = await getGitHubData(teamsUrl);
  const team = teams.find((team) => team.slug === teamSlug);
  if (!team) {
    throw new Error(`Team "${teamSlug}" not found in organization "${config.organizationName}"`);
  }
  const reposUrl = `https://api.github.com/teams/${team.id}/repos`;
  return await getGitHubData(reposUrl);
};

const getUserInfo = async (username) => {
  const userUrl = `https://api.github.com/users/${username}`;
  return await getGitHubData(userUrl);
};

module.exports = {
  getOrganizationData,
  getOrganizationMembers,
  getOrganizationRepositories,
  getOrganizationTeams,
  getTeamMembers,
  getTeamRepositories,
  getUserInfo,
};