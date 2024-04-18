// src/cron/githubCron.js
const cron = require('node-cron');
const githubController = require('../controllers/githubController');
const mongodbService = require('../services/mongodbService');

const updateGitHubData = async () => {
  try {
    console.log('Fetching organization data from GitHub...');
    const orgData = await githubController.getOrganizationData();
    console.log('Saving organization data to MongoDB...');
    await mongodbService.saveOrganization(orgData);

    console.log('Fetching organization members from GitHub...');
    const members = await githubController.getOrganizationMembers();
    const memberPromises = members.map(async (member) => {
      const userData = await githubController.getUserInfo(member.login);
      console.log('Saving user data to MongoDB...');
      await mongodbService.saveUser(userData);
    });
    await Promise.all(memberPromises);

    console.log('Fetching organization repositories from GitHub...');
    const repositories = await githubController.getOrganizationRepositories();
    const repositoryPromises = repositories.map(async (repo) => {
      console.log('Saving repository data to MongoDB...');
      await mongodbService.saveRepository(repo);
    });
    await Promise.all(repositoryPromises);

    console.log('Fetching organization teams from GitHub...');
    const teams = await githubController.getOrganizationTeams();
    const teamPromises = teams.map(async (team) => {
      console.log('Saving team data to MongoDB...');
      await mongodbService.saveTeam(team);
      const teamMembers = await githubController.getTeamMembers(team.slug);
      const teamMemberPromises = teamMembers.map(async (member) => {
        const userData = await githubController.getUserInfo(member.login);
        console.log('Saving user data to MongoDB...');
        await mongodbService.saveUser(userData);
      });
      await Promise.all(teamMemberPromises);
    });
    await Promise.all(teamPromises);

    console.log('GitHub data updated successfully');
  } catch (error) {
    console.error('Error updating GitHub data:', error);
  }
};

// Trigger the updateGitHubData function immediately
updateGitHubData();
console.log('GitHub data updated immediately');

// Schedule the cron job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    await updateGitHubData();
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

console.log('GitHub data will be updated every 5 minutes');