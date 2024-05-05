import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { App } from "@slack/bolt";
import winston from "winston";
import { errorHandler } from "./utils/errorHandler";
import { slackBotToken, slackSigningSecret } from "../config/envConfig";
import { chatGptRouter } from "./routes/chatGpt.routes";
import { githubRouter } from "./routes/github.routes";
import { slackRouter } from "./routes/slack.routes";
import {port} from '../config/envConfig'

const app = express();

const slackApp = new App({
  token: slackBotToken,
  signingSecret: slackSigningSecret,
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  defaultMeta: { service: "github-slack-app" },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/slack/commands", chatGptRouter);
app.use("/slack/commands", slackRouter);
app.use("/slack/commands", githubRouter);

slackApp.event("app_mention", async ({ event, context, say }) => {
  try {
    logger.info("Received event:", event);
  } catch (error) {
    logger.error("Error handling Slack event:", error);
  }
});

app.post("/slack/events", async (req: Request, res: Response) => {
  const { challenge } = req.body;
  if (challenge) {
    res.send(challenge);
  } else {
    res.status(400).send("Bad Request");
  }
});

app.use(errorHandler);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Unhandled error:", err);
  res.status(500).send("Internal Server Error");
});

app.listen(4000, () => {
  logger.info("Server running on port 4000!");
});

(async () => {
  await slackApp.start(port || 4000);
  logger.info(`Slack app is running on port ${process.env.PORT || 4000}`);
})();

process.on("unhandledRejection", (error: any) => {
  logger.error("Unhandled Rejection:", error);
  process.exit(1);
});
