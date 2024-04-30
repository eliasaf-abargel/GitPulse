const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${config.githubToken}`,
  },
});

/**
 * Fetches the repositories for the configured GitHub organization.
 * @returns {Promise<Array>} - An array of repository objects.
 */
async function getOrganizationRepositories() {
  try {
    const response = await githubApi.get(`/orgs/${config.organizationName}/repos`);
    return response.data;
  } catch (error) {
    logger.error('Error fetching organization repositories:', error);
    throw error;
  }
}

/**
 * Fetches the details of a specific repository.
 * @param {string} repoName - The name of the repository.
 * @returns {Promise<Object>} - The repository details.
 */
async function getRepositoryDetails(repoName) {
  try {
    const response = await githubApi.get(`/repos/${config.organizationName}/${repoName}`);
    const repoDetails = response.data;
    const contributors = await getRepositoryContributors(repoName);
    const languages = await getRepositoryLanguages(repoName);
    return {
      name: repoDetails.name,
      description: repoDetails.description,
      private: repoDetails.private,
      url: repoDetails.html_url,
      createdAt: repoDetails.created_at,
      updatedAt: repoDetails.updated_at,
      contributors,
      languages,
    };
  } catch (error) {
    logger.error(`Error fetching details for repository: ${repoName}`, error);
    throw error;
  }
}

/**
 * Fetches the contributors for a specific repository.
 * @param {string} repoName - The name of the repository.
 * @returns {Promise<Array>} - An array of contributor usernames.
 */
async function getRepositoryContributors(repoName) {
  try {
    const response = await githubApi.get(`/repos/${config.organizationName}/${repoName}/contributors`);
    return response.data.map((contributor) => contributor.login);
  } catch (error) {
    logger.error(`Error fetching contributors for repository: ${repoName}`, error);
    throw error;
  }
}

/**
 * Fetches the languages used in a specific repository.
 * @param {string} repoName - The name of the repository.
 * @returns {Promise<Array>} - An array of programming languages.
 */
async function getRepositoryLanguages(repoName) {
  try {
    const response = await githubApi.get(`/repos/${config.organizationName}/${repoName}/languages`);
    return Object.keys(response.data);
  } catch (error) {
    logger.error(`Error fetching languages for repository: ${repoName}`, error);
    throw error;
  }
}

/**
 * Fetches the members of the configured GitHub organization.
 * @returns {Promise<Array>} - An array of member objects.
 */
async function getOrganizationMembers() {
  try {
    const response = await githubApi.get(`/orgs/${config.organizationName}/members`);
    return response.data.map((member) => ({
      login: member.login,
      url: member.html_url,
    }));
  } catch (error) {
    logger.error('Error fetching organization members:', error);
    throw error;
  }
}

/**
 * Fetches the details of a specific user.
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} - The user details.
 */
async function getUserDetails(username) {
  try {
    const response = await githubApi.get(`/users/${username}`);
    const userDetails = response.data;
    const repos = await getUserRepositories(username);
    const organizations = await getUserOrganizations(username);
    return {
      login: userDetails.login,
      name: userDetails.name,
      email: userDetails.email,
      location: userDetails.location,
      bio: userDetails.bio,
      publicRepos: userDetails.public_repos,
      followers: userDetails.followers,
      following: userDetails.following,
      createdAt: userDetails.created_at,
      updatedAt: userDetails.updated_at,
      repositories: repos,
      organizations: organizations,
    };
  } catch (error) {
    logger.error(`Error fetching details for user: ${username}`, error);
    throw error;
  }
}

/**
 * Fetches the repositories for a specific user.
 * @param {string} username - The username of the user.
 * @returns {Promise<Array>} - An array of repository names.
 */
async function getUserRepositories(username) {
  try {
    const response = await githubApi.get(`/users/${username}/repos`);
    return response.data.map((repo) => repo.name);
  } catch (error) {
    logger.error(`Error fetching repositories for user: ${username}`, error);
    throw error;
  }
}

/**
 * Fetches the organizations for a specific user.
 * @param {string} username - The username of the user.
 * @returns {Promise<Array>} - An array of organization names.
 */
async function getUserOrganizations(username) {
  try {
    const response = await githubApi.get(`/users/${username}/orgs`);
    return response.data.map((org) => org.login);
  } catch (error) {
    logger.error(`Error fetching organizations for user: ${username}`, error);
    throw error;
  }
}

/**
 * Fetches the teams for the configured GitHub organization.
 * @returns {Promise<Array>} - An array of team objects.
 */
async function getOrganizationTeams() {
  try {
    const response = await githubApi.get(`/orgs/${config.organizationName}/teams`);
    return response.data.map((team) => ({
      id: team.id,
      name: team.name,
      description: team.description,
      privacy: team.privacy,
      permission: team.permission,
      membersCount: team.members_count,
      reposCount: team.repos_count,
    }));
  } catch (error) {
    logger.error('Error fetching organization teams:', error);
    throw error;
  }
}

/**
 * Fetches the details of a specific team, including its members and repositories.
 * @param {string} teamName - The name of the team.
 * @returns {Promise<Object>} - The team details.
 */
async function getTeamDetails(teamName) {
  try {
    const teams = await getOrganizationTeams();
    const team = teams.find((t) => t.name === teamName);
    if (!team) {
      logger.warn(`Team "${teamName}" not found`);
      return null;
    }
    const members = await getTeamMembers(team.id);
    const repos = await getTeamRepositories(team.id);
    return {
      id: team.id,
      name: team.name,
      description: team.description,
      privacy: team.privacy,
      permission: team.permission,
      members,
      repositories: repos,
    };
  } catch (error) {
    logger.error(`Error fetching details for team: ${teamName}`, error);
    throw error;
  }
}

/**
 * Fetches the members of a specific team.
 * @param {number} teamId - The ID of the team.
 * @returns {Promise<Array>} - An array of member usernames.
 */
async function getTeamMembers(teamId) {
  try {
    const response = await githubApi.get(`/teams/${teamId}/members`);
    return response.data.map((member) => member.login);
  } catch (error) {
    logger.error(`Error fetching members for team: ${teamId}`, error);
    throw error;
  }
}

/**
 * Fetches the repositories associated with a specific team.
 * @param {number} teamId - The ID of the team.
 * @returns {Promise<Array>} - An array of repository names.
 */
async function getTeamRepositories(teamId) {
  try {
    const response = await githubApi.get(`/teams/${teamId}/repos`);
    return response.data.map((repo) => repo.name);
  } catch (error) {
    logger.error(`Error fetching repositories for team: ${teamId}`, error);
    throw error;
  }
}

/**
 * Fetches the details of the configured GitHub organization.
 * @returns {Promise<Object>} - The organization details.
 */
async function getOrganizationDetails() {
  try {
    const response = await githubApi.get(`/orgs/${config.organizationName}`);
    const orgDetails = response.data;
    const members = await getOrganizationMembers();
    const teams = await getOrganizationTeams();
    const repos = await getOrganizationRepositories();
    return {
      login: orgDetails.login,
      name: orgDetails.name,
      description: orgDetails.description,
      blog: orgDetails.blog,
      location: orgDetails.location,
      email: orgDetails.email,
      publicRepos: orgDetails.public_repos,
      members,
      teams,
      repositories: repos,
    };
  } catch (error) {
    logger.error('Error fetching organization details:', error);
    throw error;
  }
}

module.exports = {
  getOrganizationRepositories,
  getRepositoryDetails,
  getRepositoryContributors,
  getRepositoryLanguages,
  getOrganizationMembers,
  getUserDetails,
  getUserRepositories,
  getUserOrganizations,
  getOrganizationTeams,
  getTeamDetails,
  getTeamMembers,
  getTeamRepositories,
  getOrganizationDetails,
};