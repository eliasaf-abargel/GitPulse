import axios from "axios";
import { organizationName, githubToken } from "../config/envConfig";
import logger from "../utils/logger";
import { CustomError } from "../utils/errorHandler";
import { GitHubMember, Repository } from "../interfaces/gtihub.interface";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `token ${githubToken}`,
  },
});

const getOrganizationRepositoriesFromGit = async () => {
  try {
    let page = 1;
    let allRepositories: Repository[] = [];

    while (true) {
      const response = await githubApi.get(`/orgs/${organizationName}/repos`, {
        params: {
          page: page,
          per_page: 200,
        },
      });

      allRepositories = allRepositories.concat(
        response.data.map((repo: any) => ({
          name: repo.name,
          url: repo.html_url,
          private: repo.private,
          organization: organizationName,
        }))
      );

      if (response.data.length < 100) {
        break;
      }

      page++;
    }

    return allRepositories;
  } catch (error) {
    logger.error("Error fetching organization repositories:", error);
    throw new CustomError("Failed to fetch organization repositories", 500);
  }
};

const getRepositoryOwnersFromGit = async (
  repoName: string
): Promise<string[]> => {
  try {
    const response = await githubApi.get(
      `/repos/${organizationName}/${repoName}/contributors`
    );
    return response.data.map((contributor: any) => contributor.login);
  } catch (error) {
    logger.error(`Error fetching owners for repository: ${repoName}`, error);
    throw new CustomError(
      `Failed to fetch owners for repository: ${repoName}`,
      500
    );
  }
};

const getLastCommitDetailsFromGit = async (repoName: string) => {
  try {
    const response = await githubApi.get(
      `/repos/${organizationName}/${repoName}/commits/HEAD`
    );
    const lastCommit = response.data;
    return {
      sha: lastCommit.sha,
      author: lastCommit.commit.author.name,
      message: lastCommit.commit.message,
      date: lastCommit.commit.author.date,
    };
  } catch (error) {
    logger.error(
      `Error fetching last commit details for repository: ${repoName}`,
      error
    );
    throw new CustomError(
      `Failed to fetch last commit details for repository: ${repoName}`,
      500
    );
  }
};
const getRepositoryDetailsFromGit = async (repoName: string) => {
  try {
    const response = await githubApi.get(
      `/repos/${organizationName}/${repoName}`
    );
    const repoDetails = response.data;
    const contributors = await getRepositoryContributorsFromGit(repoName);
    const languages = await getRepositoryLanguagesFromGit(repoName);
    const teams = await getRepositoryTeamsFromGit(repoName);
    return {
      name: repoDetails.name,
      description: repoDetails.description,
      private: repoDetails.private,
      url: repoDetails.html_url,
      createdAt: repoDetails.created_at,
      updatedAt: repoDetails.updated_at,
      contributors,
      languages,
      teams,
    };
  } catch (error) {
    logger.error(`Error fetching details for repository: ${repoName}`, error);
    throw new CustomError(
      `Failed to fetch details for repository: ${repoName}`,
      500
    );
  }
};

const getRepositoryTeamsFromGit = async (repoName: string) => {
  try {
    const response = await githubApi.get(
      `/repos/${organizationName}/${repoName}/teams`
    );
    return response.data.map((team: { name: string }) => team.name);
  } catch (error) {
    logger.error(`Error fetching teams for repository: ${repoName}`, error);
    throw new CustomError(
      `Failed to fetch teams for repository: ${repoName}`,
      500
    );
  }
};

const getRepositoryContributorsFromGit = async (
  repoName: string
): Promise<string[]> => {
  try {
    const response = await githubApi.get(
      `/repos/${organizationName}/${repoName}/contributors`
    );
    return response.data.map(
      (contributor: { login: string }) => contributor.login
    );
  } catch (error) {
    logger.error(
      `Error fetching contributors for repository: ${repoName}`,
      error
    );
    throw new CustomError(
      `Failed to fetch contributors for repository: ${repoName}`,
      500
    );
  }
};

const getRepositoryLanguagesFromGit = async (repoName: string) => {
  try {
    const response = await githubApi.get(
      `/repos/${organizationName}/${repoName}/languages`
    );
    return Object.keys(response.data);
  } catch (error) {
    logger.error(`Error fetching languages for repository: ${repoName}`, error);
    throw new CustomError(
      `Failed to fetch languages for repository: ${repoName}`,
      500
    );
  }
};

const getOrganizationMembersFromGit = async (): Promise<
  { login: string; url: string }[]
> => {
  try {
    const response = await githubApi.get(`/orgs/${organizationName}/members`);
    return response.data.map((member: GitHubMember) => ({
      login: member.login,
      url: member.html_url,
    }));
  } catch (error) {
    logger.error("Error fetching organization members:", error);
    throw new CustomError("Failed to fetch organization members", 500);
  }
};

const getUserDetailsFromGit = async (username: string) => {
  try {
    const response = await githubApi.get(`/users/${username}`);
    const userDetails = response.data;
    const repos = await getUserRepositoriesFromGit(username);
    const organizations = await getUserOrganizationsFromGit(username);
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
    throw new CustomError(`Failed to fetch details for user: ${username}`, 500);
  }
};

const getUserRepositoriesFromGit = async (
  username: string
): Promise<string[]> => {
  try {
    const response = await githubApi.get(`/users/${username}/repos`);
    return response.data.map((repo: { name: string }) => repo.name);
  } catch (error) {
    logger.error(`Error fetching repositories for user: ${username}`, error);
    throw new CustomError(
      `Failed to fetch repositories for user: ${username}`,
      500
    );
  }
};

const getUserOrganizationsFromGit = async (
  username: string
): Promise<string[]> => {
  try {
    const response = await githubApi.get(`/users/${username}/orgs`);
    return response.data.map((org: { login: string }) => org.login);
  } catch (error) {
    logger.error(`Error fetching organizations for user: ${username}`, error);
    throw new CustomError(
      `Failed to fetch organizations for user: ${username}`,
      500
    );
  }
};
////????????????
const getOrganizationTeamsFromGit = async (): Promise<
  {
    id: number;
    name: string;
    description: string;
    privacy: string;
    permission: string;
    membersCount: number;
    reposCount: string;
  }[]
> => {
  try {
    const response = await githubApi.get(`/orgs/${organizationName}/teams`);
    return response.data.map(
      (team: {
        id: number;
        name: string;
        description: string;
        privacy: string;
        permission: string;
        membersCount: number;
        reposCount: string;
      }) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        privacy: team.privacy,
        permission: team.permission,
        membersCount: team.membersCount,
        reposCount: team.reposCount,
      })
    );
  } catch (error) {
    logger.error("Error fetching organization teams:", error);
    throw new CustomError("Failed to fetch organization teams", 500);
  }
};

const getTeamDetailsFromGit = async (teamName: string) => {
  try {
    const teams = await getOrganizationTeamsFromGit();
    const team = teams.find((t) => t.name === teamName);
    if (!team) {
      logger.warn(`Team "${teamName}" not found`);
      throw new CustomError(`Team "${teamName}" not found`, 404);
    }
    const members = await getTeamMembersFromGit(team.id);
    const repos = await getTeamRepositoriesFromGit(team.id);
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
};

const getTeamMembersFromGit = async (
  teamId: number
): Promise<{ login: string; url: string }[]> => {
  try {
    const response = await githubApi.get(`/teams/${teamId}/members`);
    return response.data.map((member: { login: string; html_url: string }) => ({
      login: member.login,
      url: member.html_url,
    }));
  } catch (error) {
    logger.error(`Error fetching members for team: ${teamId}`, error);
    throw new CustomError(`Failed to fetch members for team: ${teamId}`, 500);
  }
};
const getTeamRepositoriesFromGit = async (teamId: number) => {
  try {
    const response = await githubApi.get(`/teams/${teamId}/repos`);
    return response.data.map((repo: { name: string }) => repo.name);
  } catch (error) {
    logger.error(`Error fetching repositories for team: ${teamId}`, error);
    throw new CustomError(
      `Failed to fetch repositories for team: ${teamId}`,
      500
    );
  }
};

const getOrganizationDetailsFromGit = async () => {
  try {
    const response = await githubApi.get(`/orgs/${organizationName}`);
    return response.data;
  } catch (error) {
    logger.error("Error fetching organization details:", error);
    throw new CustomError("Failed to fetch organization details", 500);
  }
};
// const getRepositoryTeamsF=(repoName: any)=> {
//   throw new Error("Function not implemented.");
// }

export {
  getOrganizationRepositoriesFromGit,
  getRepositoryDetailsFromGit,
  getLastCommitDetailsFromGit,
  getRepositoryTeamsFromGit,
  getRepositoryContributorsFromGit,
  getRepositoryLanguagesFromGit,
  getRepositoryOwnersFromGit,
  getOrganizationMembersFromGit,
  getUserDetailsFromGit,
  getUserRepositoriesFromGit,
  getUserOrganizationsFromGit,
  getOrganizationTeamsFromGit,
  getTeamDetailsFromGit,
  getTeamMembersFromGit,
  getTeamRepositoriesFromGit,
  getOrganizationDetailsFromGit,
};
