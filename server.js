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
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Handle Slack events and actions
slackApp.use(async ({ event, context, ack, respond }) => {
  try {
    // Acknowledge the event
    await ack();

    // Process the event
    // Add your event handling logic here
    logger.info('Received event:', event);

    // Respond to the event (if needed)
    // await respond('Event received');
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

// Handle errors
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