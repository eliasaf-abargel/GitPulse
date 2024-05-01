const express = require('express');
const router = express.Router();

const githubController = require('./controllers/githubController');
const slackController = require('./controllers/slackController');
const { errorHandler } = require('./utils/errorHandler');

router.get('/slack/commands/repo-list', githubController.getOrganizationRepositories);
router.get('/slack/commands/repo-details/:repoName', githubController.getRepositoryDetails);
router.get('/slack/commands/user-list', githubController.getOrganizationMembers);
router.get('/slack/commands/user-details/:username', githubController.getUserDetails);
router.get('/slack/commands/team-list', githubController.getOrganizationTeams);
router.get('/slack/commands/team-details/:teamName', githubController.getTeamDetails);
router.get('/slack/commands/org-details', githubController.getOrganizationDetails);

router.post('/slack/commands', (req, res) => {
  slackController.handleSlackCommand(req, res);
});

router.use(errorHandler);

module.exports = router;