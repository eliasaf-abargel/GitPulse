const githubService = require('../services/githubService');
const logger = require('../utils/logger');

/**
 * Fetches the organization repositories and returns the data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getOrganizationRepositories(req, res) {
  try {
    const repositories = await githubService.getOrganizationRepositories();
    logger.info('Successfully fetched organization repositories');
    res.status(200).json(repositories);
  } catch (error) {
    logger.error('Error fetching organization repositories:', error);
    res.status(500).json({ error: 'Failed to fetch organization repositories' });
  }
}

/**
 * Fetches the details of a specific repository and returns the data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getRepositoryDetails(req, res) {
  try {
    const { repoName } = req.params;
    const repoDetails = await githubService.getRepositoryDetails(repoName);
    logger.info(`Successfully fetched details for repository: ${repoName}`);
    res.status(200).json(repoDetails);
  } catch (error) {
    logger.error(`Error fetching details for repository: ${req.params.repoName}`, error);
    res.status(500).json({ error: 'Failed to fetch repository details' });
  }
}

/**
 * Fetches the last commit details for a specific repository and returns the data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getLastCommitDetails(req, res) {
  try {
    const { repoName } = req.params;
    const lastCommitDetails = await githubService.getLastCommitDetails(repoName);
    logger.info(`Successfully fetched last commit details for repository: ${repoName}`);
    res.status(200).json(lastCommitDetails);
  } catch (error) {
    logger.error(`Error fetching last commit details for repository: ${req.params.repoName}`, error);
    res.status(500).json({ error: 'Failed to fetch last commit details' });
  }
}


/**
 * Fetches the organization members and returns the data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getOrganizationMembers(req, res) {
  try {
    const members = await githubService.getOrganizationMembers();
    logger.info('Successfully fetched organization members');
    res.status(200).json(members);
  } catch (error) {
    logger.error('Error fetching organization members:', error);
    res.status(500).json({ error: 'Failed to fetch organization members' });
  }
}

/**
 * Fetches the details of a specific user and returns the data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getUserDetails(req, res) {
  try {
    const { username } = req.params;
    const userDetails = await githubService.getUserDetails(username);
    logger.info(`Successfully fetched details for user: ${username}`);
    res.status(200).json(userDetails);
  } catch (error) {
    logger.error(`Error fetching details for user: ${req.params.username}`, error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
}

/**
 * Fetches the organization teams and returns the data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getOrganizationTeams(req, res) {
  try {
    const teams = await githubService.getOrganizationTeams();
    logger.info('Successfully fetched organization teams');
    res.status(200).json(teams);
  } catch (error) {
    logger.error('Error fetching organization teams:', error);
    res.status(500).json({ error: 'Failed to fetch organization teams' });
  }
}

/**
 * Fetches the details of a specific team and returns the data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getTeamDetails(req, res) {
  try {
    const { teamName } = req.params;
    const teamDetails = await githubService.getTeamDetails(teamName);
    if (!teamDetails) {
      logger.warn(`Team "${teamName}" not found`);
      res.status(404).json({ error: `Team "${teamName}" not found` });
      return;
    }
    logger.info(`Successfully fetched details for team: ${teamName}`);
    res.status(200).json(teamDetails);
  } catch (error) {
    logger.error(`Error fetching details for team: ${req.params.teamName}`, error);
    res.status(500).json({ error: 'Failed to fetch team details' });
  }
}

/**
 * Fetches the organization details and returns the data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
async function getOrganizationDetails(req, res) {
  try {
    const orgDetails = await githubService.getOrganizationDetails();
    logger.info('Successfully fetched organization details');
    res.status(200).json(orgDetails);
  } catch (error) {
    logger.error('Error fetching organization details:', error);
    res.status(500).json({ error: 'Failed to fetch organization details' });
  }
}

module.exports = {
  getOrganizationRepositories,
  getRepositoryDetails,
  getLastCommitDetails,
  getOrganizationMembers,
  getUserDetails,
  getOrganizationTeams,
  getTeamDetails,
  getOrganizationDetails,
};