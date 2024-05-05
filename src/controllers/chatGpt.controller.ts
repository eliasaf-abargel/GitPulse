import { Request, Response } from "express";
import logger from "../utils/logger";
import { handleError, InternalServerError } from "../utils/errorHandler";
import { sendResponseGptervices } from "../services/chatgpt.service";
import { askChatGPTSlackServices } from "../services/slack.service";

const handleAskCommand = async (req: Request, res: Response) => {
  const { text, response_url } = req.body;

  try {
    logger.info("Received /ask command from Slack");

    await sendResponseGptervices(response_url, "Asking ChatGPT...");

    const answer = await askChatGPTSlackServices(text);

    await sendResponseGptervices(response_url, answer);

    res.status(200).send();
  } catch (error) {
    logger.error("Error handling /ask command:", error);

    if (error instanceof InternalServerError) {
      await sendResponseGptervices(
        response_url,
        "An internal server error occurred. Please try again later."
      );
    } else {
      await sendResponseGptervices(
        response_url,
        "An error occurred. Please try again later."
      );
    }

    handleError(error as Error, "Error handling /ask command");
    res.status(500).send("Internal Server Error");
  }
};

export { handleAskCommand };
