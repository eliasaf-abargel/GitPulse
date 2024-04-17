// server/src/cronJobs/githubCronJob.js
const cron = require('node-cron');
const githubService = require('../services/githubService');
const mongodbService = require('../services/mongodbService');

const updateGitHubData = async () => {
  try {
    const orgData = await githubService.getOrganizationData();
    await mongodbService.saveOrganization(orgData);

    const members = await githubService.getOrganizationMembers();
    const memberPromises = members.map(async (member) => {
      const userData = await githubService.getUserInfo(member.login);
      await mongodbService.saveUser(userData);
    });
    await Promise.all(memberPromises);

    const repositories = await githubService.getOrganizationRepositories();
    const repositoryPromises = repositories.map(async (repo) => {
      await mongodbService.saveRepository(repo);
    });
    await Promise.all(repositoryPromises);

    const teams = await githubService.getOrganizationTeams();
    const teamPromises = teams.map(async (team) => {
      await mongodbService.saveTeam(team);
      const teamMembers = await githubService.getTeamMembers(team.slug);
      const teamMemberPromises = teamMembers.map(async (member) => {
        const userData = await githubService.getUserInfo(member.login);
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

// Schedule the cron job to run every hour
cron.schedule('0 * * * *', updateGitHubData);