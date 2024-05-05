import dotenv from "dotenv";
dotenv.config();

export const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
export const slackBotToken = process.env.SLACK_BOT_TOKEN;
export const githubToken = process.env.GITHUB_TOKEN;
export const organizationName = process.env.GITHUB_ORG;
export const port = process.env.PORT;
export const slackChannel = process.env.SLACK_CHANNEL;
export const chatgptApiKey = process.env.CHATGPT_API_KEY;

slackSigningSecret;
slackBotToken;
githubToken;
organizationName;
port;
slackChannel;
chatgptApiKey;
