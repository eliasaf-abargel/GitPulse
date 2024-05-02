require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { App } = require('@slack/bolt');
const winston = require('winston');
const routes = require('./routes');
const config = require('./config/config');
const { errorHandler } = require('./utils/errorHandler');

const app = express();

const slackApp = new App({
  token: config.slackBotToken,
  signingSecret: config.slackSigningSecret,
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  defaultMeta: { service: 'github-slack-app' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Handle Slack events and actions
slackApp.event('app_mention', async ({ event, context, say }) => {
  try {
    logger.info('Received event:', event);

    // Process the event
    // Add your event handling logic here

    // Respond to the event (if needed)
    // await say('Event received');
  } catch (error) {
    logger.error('Error handling Slack event:', error);
  }
});

// Handle the challenge request for event subscription verification
app.post('/slack/events', async (req, res) => {
  const { challenge } = req.body;
  if (challenge) {
    // Respond with the challenge value for verification
    res.send(challenge);
  } else {
    res.status(400).send('Bad Request');
  }
});

// Error handling middleware
app.use(errorHandler);

// Start the Express server
app.listen(4000, () => {
  logger.info('Server running on port 4000!');
});

// Start the Slack app
(async () => {
  await slackApp.start(process.env.PORT || 4000);
  logger.info(`Slack app is running on port ${process.env.PORT || 4000}`);
})();

// Handle unhandled rejections and uncaught exceptions
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});