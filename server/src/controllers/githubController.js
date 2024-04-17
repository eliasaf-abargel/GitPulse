// Desc: Controller for handling GitHub API requests /src/controllers/githubController.js
import {getRepositoriesMongoDB, getUserInfoMongoDB} from "../queries/githubQureies";
const githubService = require('~/services/githubService');


// Get authenticated user's repositories
export const getRepositories = async (req, res) => {
  try {
    const repositories = await getRepositoriesMongoDB();
    res.json(repositories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching repositories' });
  }
};

// Get a specific repository by name
export const getRepositoryByName = async (req, res) => {
  try {
    const { owner, repoName } = req.params;
    const repository = await getRepositoryByName(owner, repoName);
    res.json(repository);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching repository' });
  }
};

// Get information about a specific user
export const getUserInfo = async (req, res) => {
  try {
    const { username } = req.params;
    const userInfo = await getUserInfoMongoDB(username);
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user information' });
  }
};

// Get organizations for a specific user
export const getUserOrganizations = async (req, res) => {
  try {
    const { username } = req.params;
    const organizations = await getUserOrganizations(username);
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user organizations' });
  }
};

// Get the authenticated user's organization and its members
exports.getOrganizationMembers = async (req, res) => {
  try {
    const organizationMembers = await githubService.getOrganizationMembers();
    res.json(organizationMembers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization members' });
  }
};

// Get repositories for a specific organization
exports.getOrganizationRepositories = async (req, res) => {
  try {
    const { orgName } = req.params;
    const repositories = await githubService.getOrganizationRepositories(orgName);
    res.json(repositories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization repositories' });
  }
};

// Get teams for a specific organization
exports.getOrganizationTeams = async (req, res) => {
  try {
    const { orgName } = req.params;
    const teams = await githubService.getOrganizationTeams(orgName);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization teams' });
  }
};

// Get members for a specific team
exports.getTeamMembers = async (req, res) => {
  try {
    const { orgName, teamName } = req.params;
    const teamMembers = await githubService.getTeamMembers(orgName, teamName);
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members' });
  }
};

// Get repositories for a specific team
exports.getTeamRepositories = async (req, res) => {
  try {
    const { orgName, teamName } = req.params;
    const repositories = await githubService.getTeamRepositories(orgName, teamName);
    res.json(repositories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team repositories' });
  }
};

// Get a specific organization by name
exports.getOrganizationByName = async (req, res) => {
  try {
    const { orgName } = req.params;
    const organization = await githubService.getOrganizationByName(orgName);
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization' });
  }
};

// Get members of a specific organization
exports.getOrganizationMembersByName = async (req, res) => {
  try {
    const { orgName } = req.params;
    const members = await githubService.getOrganizationMembersByName(orgName);
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization members' });
  }
};

// Get teams of a specific organization
exports.getOrganizationTeamsByName = async (req, res) => {
  try {
    const { orgName } = req.params;
    const teams = await githubService.getOrganizationTeamsByName(orgName);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization teams' });
  }
};

// Get members of a specific team in an organization
exports.getTeamMembersByName = async (req, res) => {
  try {
    const { orgName, teamSlug } = req.params;
    const members = await githubService.getTeamMembersByName(orgName, teamSlug);
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members' });
  }
};