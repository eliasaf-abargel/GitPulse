import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  getLastCommitDetailsFromGit,
  getOrganizationDetailsFromGit,
  getOrganizationMembersFromGit,
  getOrganizationRepositoriesFromGit,
  getOrganizationTeamsFromGit,
  getRepositoryDetailsFromGit,
  getTeamDetailsFromGit,
  getUserDetailsFromGit,
} from "../services/github.service";

const getOrganizationRepositories = async (req: Request, res: Response) => {
  try {
    const repositories = await getOrganizationRepositoriesFromGit();
    logger.info("Successfully fetched organization repositories");
    res.status(200).json(repositories);
  } catch (error) {
    logger.error("Error fetching organization repositories:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch organization repositories" });
  }
};

const getRepositoryDetails = async (req: Request, res: Response) => {
  try {
    const { repoName } = req.params;
    const repoDetails = await getRepositoryDetailsFromGit(repoName);
    logger.info(`Successfully fetched details for repository: ${repoName}`);
    res.status(200).json(repoDetails);
  } catch (error) {
    logger.error(
      `Error fetching details for repository: ${req.params.repoName}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch repository details" });
  }
};

const getLastCommitDetails = async (req: Request, res: Response) => {
  try {
    const { repoName } = req.params;
    const lastCommitDetails = await getLastCommitDetailsFromGit(repoName);
    logger.info(
      `Successfully fetched last commit details for repository: ${repoName}`
    );
    res.status(200).json(lastCommitDetails);
  } catch (error) {
    logger.error(
      `Error fetching last commit details for repository: ${req.params.repoName}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch last commit details" });
  }
};

const getOrganizationMembers = async (req: Request, res: Response) => {
  try {
    const members = await getOrganizationMembersFromGit();
    logger.info("Successfully fetched organization members");
    res.status(200).json(members);
  } catch (error) {
    logger.error("Error fetching organization members:", error);
    res.status(500).json({ error: "Failed to fetch organization members" });
  }
};

const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const userDetails = await getUserDetailsFromGit(username);
    logger.info(`Successfully fetched details for user: ${username}`);
    res.status(200).json(userDetails);
  } catch (error) {
    logger.error(
      `Error fetching details for user: ${req.params.username}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

const getOrganizationTeams = async (req: Request, res: Response) => {
  try {
    const teams = await getOrganizationTeamsFromGit();
    logger.info("Successfully fetched organization teams");
    res.status(200).json(teams);
  } catch (error) {
    logger.error("Error fetching organization teams:", error);
    res.status(500).json({ error: "Failed to fetch organization teams" });
  }
};

const getTeamDetails = async (req: Request, res: Response) => {
  try {
    const { teamName } = req.params;
    const teamDetails = await getTeamDetailsFromGit(teamName);
    if (!teamDetails) {
      logger.warn(`Team "${teamName}" not found`);
      res.status(404).json({ error: `Team "${teamName}" not found` });
      return;
    }
    logger.info(`Successfully fetched details for team: ${teamName}`);
    res.status(200).json(teamDetails);
  } catch (error) {
    logger.error(
      `Error fetching details for team: ${req.params.teamName}`,
      error
    );
    res.status(500).json({ error: "Failed to fetch team details" });
  }
};

const getOrganizationDetails = async (req: Request, res: Response) => {
  try {
    const orgDetails = await getOrganizationDetailsFromGit();
    logger.info("Successfully fetched organization details");
    res.status(200).json(orgDetails);
  } catch (error) {
    logger.error("Error fetching organization details:", error);
    res.status(500).json({ error: "Failed to fetch organization details" });
  }
};

export {
  getOrganizationRepositories,
  getRepositoryDetails,
  getLastCommitDetails,
  getOrganizationMembers,
  getUserDetails,
  getOrganizationTeams,
  getTeamDetails,
  getOrganizationDetails,
};
