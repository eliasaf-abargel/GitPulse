import express from "express";
const chatGptRouter = express.Router();
import { errorHandler } from "../utils/errorHandler";
import { handleAskCommand } from "../controllers/chatGpt.controller";

chatGptRouter.post("/ask", handleAskCommand);

chatGptRouter.use(errorHandler);
export { chatGptRouter };
