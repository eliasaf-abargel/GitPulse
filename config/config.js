require('dotenv').config();

module.exports = {
  githubToken: process.env.GITHUB_TOKEN,
  organizationName: process.env.GITHUB_ORG,
  slackBotToken: process.env.SLACK_BOT_TOKEN,
  slackChannel: process.env.SLACK_CHANNEL,
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET,
  chatgptApiKey: process.env.CHATGPT_API_KEY,
};