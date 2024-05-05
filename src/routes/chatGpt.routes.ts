import express from "express";
const chatGptRouter = express.Router();
import { errorHandler } from "../utils/errorHandler";
import { handleAskCommandGit } from "../controllers/chatGpt.controller";

chatGptRouter.post("/ask", handleAskCommandGit);

chatGptRouter.use(errorHandler);
export { chatGptRouter };
