import { Request, Response } from "express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import logger from "../utils/logger";
import { slackChannel } from "../config/envConfig";
import { handleError } from "../utils/errorHandler";
import {
  askChatGPTSlackServices,
  getLastCommitDetailsSlackServices,
  getOrgDetailsSlackServices,
  getRepoDetailsSlackServices,
  getRepoListSlackServices,
  getTeamDetailsSlackServices,
  getTeamListSlackServices,
  getUserDetailsSlackServices,
  getUserListSlackServices,
  sendResponseSlackServices,
} from "../services/slack.service";
import { SlackConfig } from "../interfaces/slack.interface";

const slackConfigPath = path.resolve(__dirname, "../config/slack-config.yaml");
const slackConfig = yaml.load(
  fs.readFileSync(slackConfigPath, "utf8")
) as SlackConfig;

const validateSlackChannel = async (channelId: string): Promise<boolean> => {
  if (channelId !== slackChannel) {
    logger.warn(
      `Received Slack command from an unauthorized channel: ${channelId}`
    );
    return false;
  }
  logger.info(`Received Slack command from authorized channel: ${channelId}`);
  return true;
};

const dispatchSlackCommand = async (
  command: string,
  text: string,
  responseUrl: string
) => {
  const slackCommand = slackConfig.slack.commands.find(
    (cmd: { command: string }) => cmd.command === command
  );

  if (!slackCommand) {
    logger.warn(`Unknown command received: ${command}`);
    return "Unknown command. Please try again.";
  }

  try {
    logger.info(`Dispatching Slack command: ${command}`);

    await sendResponseSlackServices(responseUrl, slackCommand.response.text);

    let response;
    switch (command) {
      case "/repo-list":
        response = await getRepoListSlackServices();
        break;
      case "/repo-details":
        response = await getRepoDetailsSlackServices(text);
        break;
      case "/user-list":
        response = await getUserListSlackServices();
        break;
      case "/user-details":
        response = await getUserDetailsSlackServices(text);
        break;
      case "/team-list":
        response = await getTeamListSlackServices();
        break;
      case "/team-details":
        response = await getTeamDetailsSlackServices(text);
        break;
      case "/org-details":
        response = await getOrgDetailsSlackServices();
        break;
      case "/last-commit":
        response = await getLastCommitDetailsSlackServices(text);
        break;
      case "/ask":
        response = await askChatGPTSlackServices(text);
        break;
      default:
        logger.warn("Unknown command. Skipping response.");
        return;
    }

    if (response !== "") {
      logger.info(`Sending final response for command ${command}`);
      await sendResponseSlackServices(responseUrl, response);
      logger.info(`Final response sent successfully`);
    } else {
      logger.warn("Final response is empty. Skipping response.");
    }
  } catch (error) {
    logger.error(`Error handling Slack command: ${command}`, error);
    await sendResponseSlackServices(
      responseUrl,
      "An error occurred while processing the command. Please try again later."
    );
    handleError(error as Error, "Error handling Slack command");
    throw error;
  }
};

const handleSlackCommand = async (
  req: Request,
  res: Response,
  next: (err?: Error) => void
): Promise<void> => {
  const { command, text, response_url, channel_id } = req.body;

  logger.info(`Received Slack command: ${command} from channel: ${channel_id}`);

  if (!(await validateSlackChannel(channel_id))) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    await dispatchSlackCommand(command, text, response_url);
    res.status(200).send();
  } catch (error) {
    logger.error(`Error handling Slack command: ${command}`, error);
    await sendResponseSlackServices(
      response_url,
      "An error occurred. Please try again later."
    );
    next(error as Error);
  }
};

export { handleSlackCommand, validateSlackChannel, dispatchSlackCommand };
