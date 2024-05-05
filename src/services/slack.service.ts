import axios from "axios";
import logger from "../utils/logger";
import { InternalServerError, handleError } from "../utils/errorHandler";
import { slackBotToken, slackChannel } from "../../config/envConfig";
import {
  getLastCommitDetailsFromGit,
  getOrganizationDetailsFromGit,
  getOrganizationMembersFromGit,
  getOrganizationRepositoriesFromGit,
  getOrganizationTeamsFromGit,
  getRepositoryDetailsFromGit,
  getTeamDetailsFromGit,
  getUserDetailsFromGit,
} from "./github.service";
import { generateChatGPTResponse } from "./chatgpt.service";
import { Repository } from "../interfaces/gtihub.interface";

const sendResponseSlackServices = async (
  responseUrl: string,
  response: string | Record<string, unknown>,
  responseType: string = "in_channel"
) => {
  try {
    let payload;
    if (typeof response === "string") {
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
    logger.error("Error sending Slack response:", error);
    handleError(error as Error, "Error sending Slack response");
    throw error;
  }
};

const sendMessageSlackServices = async (message: string) => {
  try {
    logger.info(`Sending message to Slack: ${message}`);
    await axios.post("https://slack.com/api/chat.postMessage", {
      token: slackBotToken,
      channel: slackChannel,
      text: message,
    });
    logger.info(`Message sent successfully`);
  } catch (error) {
    logger.error("Error sending message to Slack:", error);
    handleError(error as Error, "Error sending message to Slack");
    throw error;
  }
};

const getRepoListSlackServices = async () => {
  try {
    const repositories = await getOrganizationRepositoriesFromGit();
    const repoList = repositories
      .map((repo) => `• ${repo.name} (${repo.private ? "Private" : "Public"})`)
      .join("\n");
    const response = `Repositories in the organization:\n\n${repoList}`;
    logger.info("Fetched repository list successfully");
    return response;
  } catch (error) {
    logger.error("Error fetching repository list:", error);
    handleError(error as Error, "Error fetching repository list");
    throw error;
  }
};

const getRepoDetailsSlackServices = async (repoName: string) => {
  try {
    const repoDetails = await getRepositoryDetailsFromGit(repoName);
    const response =
      `Repository Details for ${repoName}:\n\n` +
      `Name: ${repoDetails.name}\n` +
      `Description: ${repoDetails.description || "No description provided"}\n` +
      `Private: ${repoDetails.private}\n` +
      `URL: ${repoDetails.url}\n` +
      `Created At: ${repoDetails.createdAt}\n` +
      `Updated At: ${repoDetails.updatedAt}\n` +
      `Contributors: ${repoDetails.contributors.join(", ")}\n` +
      `Languages: ${repoDetails.languages.join(", ")}\n` +
      `Teams: ${repoDetails.teams.join(", ")}`;
    logger.info(`Fetched details for repository: ${repoName}`);
    return response;
  } catch (error) {
    logger.error(`Error fetching details for repository: ${repoName}`, error);
    handleError(
      error as Error,
      `Error fetching details for repository: ${repoName}`
    );
    throw error;
  }
};

const getUserListSlackServices = async () => {
  try {
    const members = await getOrganizationMembersFromGit();
    const userList = members.map((member) => `• ${member.login}`).join("\n");
    const response = `Users in the organization:\n\n${userList}`;
    logger.info("Fetched user list successfully");
    return response;
  } catch (error) {
    logger.error("Error fetching user list:", error);
    handleError(error as Error, "Error fetching user list");
    throw error;
  }
};

const getUserDetailsSlackServices = async (username: string) => {
  try {
    const userDetails = await getUserDetailsFromGit(username);
    const response =
      `User Details for ${username}:\n\n` +
      `Login: ${userDetails.login}\n` +
      `Name: ${userDetails.name || "No name provided"}\n` +
      `Email: ${userDetails.email || "No email provided"}\n` +
      `Location: ${userDetails.location || "No location provided"}\n` +
      `Bio: ${userDetails.bio || "No bio provided"}\n` +
      `Public Repos: ${userDetails.publicRepos}\n` +
      `Followers: ${userDetails.followers}\n` +
      `Following: ${userDetails.following}\n` +
      `Created At: ${userDetails.createdAt}\n` +
      `Updated At: ${userDetails.updatedAt}\n` +
      `Repositories: ${
        userDetails.repositories.map((repo) => `\n• ${repo}`).join(", ") ||
        "No repositories"
      }\n` +
      `Organizations: ${
        userDetails.organizations.map((org) => `\n• ${org}`).join(", ") ||
        "No organizations"
      }`;
    logger.info(`Fetched details for user: ${username}`);
    return response;
  } catch (error) {
    logger.error(`Error fetching details for user: ${username}`, error);
    handleError(error as Error, `Error fetching details for user: ${username}`);
    throw error;
  }
};

const getTeamListSlackServices = async () => {
  try {
    const teams = await getOrganizationTeamsFromGit();
    const teamList = teams.map((team) => `• ${team.name}`).join("\n");
    const response = `Teams in the organization:\n\n${teamList}`;
    logger.info("Fetched team list successfully");
    return response;
  } catch (error) {
    logger.error("Error fetching team list:", error);
    handleError(error as Error, "Error fetching team list");
    throw error;
  }
};

const getTeamDetailsSlackServices = async (teamName: string) => {
  try {
    const teamDetails = await getTeamDetailsFromGit(teamName);
    const membersFormatted = teamDetails.members
      .map((member) => `• ${member.login}`)
      .join("\n");
    const reposFormatted = teamDetails.repositories
      ? teamDetails.repositories
          .map((repo: Repository) => `• ${repo.name}`)
          .join("\n")
      : "No repositories associated";

    const response = `
Team Details for ${teamName}:

Name: ${teamDetails.name}
Description: ${teamDetails.description || "No description provided"}
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
    handleError(error as Error, `Error fetching details for team: ${teamName}`);
    throw error;
  }
};

const getOrgDetailsSlackServices = async () => {
  try {
    const orgDetails = await getOrganizationDetailsFromGit();
    const response =
      `Organization Details:\n\n` +
      `Login: ${orgDetails.login}\n` +
      `Name: ${orgDetails.name}\n` +
      `Description: ${orgDetails.description || "No description provided"}\n` +
      `Blog: ${orgDetails.blog || "No blog provided"}\n` +
      `Location: ${orgDetails.location || "No location provided"}\n` +
      `Email: ${orgDetails.email || "No email provided"}\n` +
      `Public Repos: ${orgDetails.public_repos}\n` +
      `Public Gists: ${orgDetails.public_gists}\n` +
      `Followers: ${orgDetails.followers}\n` +
      `Following: ${orgDetails.following}\n` +
      `Created At: ${orgDetails.created_at}\n` +
      `Updated At: ${orgDetails.updated_at}`;
    logger.info("Fetched organization details successfully");
    return response;
  } catch (error) {
    logger.error("Error fetching organization details:", error);
    handleError(error as Error, "Error fetching organization details");
    throw error;
  }
};

const getLastCommitDetailsSlackServices = async (repoName: string) => {
  try {
    const lastCommitDetails = await getLastCommitDetailsFromGit(repoName);
    const response =
      `Last Commit Details for ${repoName}:\n\n` +
      `SHA: ${lastCommitDetails.sha}\n` +
      `Author: ${lastCommitDetails.author}\n` +
      `Message: ${lastCommitDetails.message}\n` +
      `Date: ${lastCommitDetails.date}`;
    logger.info(`Fetched last commit details for repository: ${repoName}`);
    return response;
  } catch (error) {
    logger.error(
      `Error fetching last commit details for repository: ${repoName}`,
      error
    );
    handleError(
      error as Error,
      `Error fetching last commit details for repository: ${repoName}`
    );
    throw error;
  }
};

const askChatGPTSlackServices = async (question: string) => {
  try {
    const answer = await generateChatGPTResponse(question);
    return answer;
  } catch (error) {
    if (error instanceof InternalServerError) {
      logger.error(
        "Internal server error occurred while asking ChatGPT:",
        error
      );
      throw error;
    } else {
      logger.error("Error asking ChatGPT:", error);
      throw new InternalServerError("Failed to generate response");
    }
  }
};

export {
  sendResponseSlackServices,
  sendMessageSlackServices,
  getRepoListSlackServices,
  getRepoDetailsSlackServices,
  getUserListSlackServices,
  getUserDetailsSlackServices,
  getTeamListSlackServices,
  getTeamDetailsSlackServices,
  getOrgDetailsSlackServices,
  getLastCommitDetailsSlackServices,
  askChatGPTSlackServices,
};
