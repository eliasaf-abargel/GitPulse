import dotenv from "dotenv"
dotenv.config();

export const githubToken = process.env.GITHUB_TOKEN;
export const organizationName = process.env.GITHUB_ORG;
export const slackBotToken = process.env.SLACK_BOT_TOKEN;
export const slackChannel = process.env.SLACK_CHANNEL;
export const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
export const chatgptApiKey = process.env.CHATGPT_API_KEY;
export const port = process.env.PORT;

githubToken;
organizationName;
slackBotToken;
slackChannel;
slackSigningSecret;
chatgptApiKey;
port;
