import express from "express";
const githubRouter = express.Router();
import { errorHandler } from "../utils/errorHandler";
import {
  getLastCommitDetails,
  getOrganizationDetails,
  getOrganizationMembers,
  getOrganizationRepositories,
  getOrganizationTeams,
  getRepositoryDetails,
  getTeamDetails,
  getUserDetails,
} from "../controllers/github.controllert";

githubRouter.get("/repo-list", getOrganizationRepositories);
githubRouter.get(
  "/repo-details/:repoName",
  getRepositoryDetails
);
githubRouter.get("/user-list", getOrganizationMembers);
githubRouter.get("/user-details/:username", getUserDetails);
githubRouter.get("/team-list", getOrganizationTeams);
githubRouter.get("/team-details/:teamName", getTeamDetails);
githubRouter.get("/org-details", getOrganizationDetails);
githubRouter.get("/last-commit/:repoName", getLastCommitDetails);
githubRouter.use(errorHandler);
export { githubRouter };
