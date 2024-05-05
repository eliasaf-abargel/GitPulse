import express from "express";
const slackRouter = express.Router();
import { handleSlackCommand } from "../controllers/slack.controller";
import { errorHandler } from "../utils/errorHandler";

slackRouter.post("/", handleSlackCommand);
slackRouter.use(errorHandler);
export { slackRouter };
