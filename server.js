// server.js

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { App } = require('@slack/bolt');
const winston = require('winston');
const routes = require('./routes');

const app = express();

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'github-slack-app' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Handle Slack events
app.use('/slack/events', async (req, res) => {
  try {
    await slackApp.requestListener()(req, res);
  } catch (error) {
    logger.error('Error handling Slack event:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the Express server
app.listen(4000, () => {
  logger.info('Server running on port 4000!');
});

// Start the Slack app
(async () => {
  await slackApp.start(process.env.PORT || 4000);
  logger.info(`Slack app is running on port ${slackApp.receiver.port}`);
})();