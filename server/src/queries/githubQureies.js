// server/src/queries/githubQureies.js
const axios = require('axios');
const config = require('~/config');
const Repository = require('../models/repository');
const User = require('../models/user');
const Organization = require('../models/organization');
const Team = require('../models/team');

const getGitHubData = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${config.githubToken}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

const saveToMongoDB = async (model, data, uniqueKey) => {
  try {
    const existingData = await model.findOne({ [uniqueKey]: data[uniqueKey] });
    if (!existingData) {
      const newData = new model(data);
      await newData.save();
    }
  } catch (error) {
    console.error(`Error saving data to MongoDB:`, error);
    throw error;
  }
};

export const getOrganizationData = async () => {
  try {
    const orgName = process.env.ORGANIZATION_NAME;
    const orgUrl = `https://api.github.com/orgs/${orgName}`;
    const orgData = await getGitHubData(orgUrl);

    await saveToMongoDB(Organization, {
      name: orgData.login,
      description: orgData.description,
      avatarUrl: orgData.avatar_url,
    }, 'name');

    return orgData;
  } catch (error) {
    console.error(`Error fetching organization data:`, error);
    throw error;
  }
};

export const getOrganizationMembers = async () => {
  try {
    const orgName = process.env.ORGANIZATION_NAME;
    const membersUrl = `https://api.github.com/orgs/${orgName}/members`;
    const members = await getGitHubData(membersUrl);

    const memberPromises = members.map(async (member) => {
      await saveToMongoDB(User, {
        username: member.login,
        avatarUrl: member.avatar_url,
      }, 'username');
    });

    await Promise.all(memberPromises);

    return members;
  } catch (error) {
    console.error(`Error fetching organization members:`, error);
    throw error;
  }
};

export const getOrganizationRepositories = async () => {
  try {
    const orgName = process.env.ORGANIZATION_NAME;
    const reposUrl = `https://api.github.com/orgs/${orgName}/repos`;
    const repositories = await getGitHubData(reposUrl);

    const repositoryPromises = repositories.map(async (repo) => {
      await saveToMongoDB(Repository, {
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        organization: orgName,
      }, 'name');
    });

    await Promise.all(repositoryPromises);

    return repositories;
  } catch (error) {
    console.error(`Error fetching organization repositories:`, error);
    throw error;
  }
};

export const getOrganizationTeams = async () => {
  try {
    const orgName = process.env.ORGANIZATION_NAME;
    const teamsUrl = `https://api.github.com/orgs/${orgName}/teams`;
    const teams = await getGitHubData(teamsUrl);

    const teamPromises = teams.map(async (team) => {
      await saveToMongoDB(Team, {
        name: team.name,
        description: team.description,
        organization: orgName,
      }, 'name');
    });

    await Promise.all(teamPromises);

    return teams;
  } catch (error) {
    console.error(`Error fetching organization teams:`, error);
    throw error;
  }
};

export const getTeamMembers = async (teamName) => {
  try {
    const orgName = process.env.ORGANIZATION_NAME;
    const teamsUrl = `https://api.github.com/orgs/${orgName}/teams`;
    const teams = await getGitHubData(teamsUrl);

    const team = teams.find((team) => team.name === teamName);

    if (!team) {
      throw new Error(`Team "${teamName}" not found in organization "${orgName}"`);
    }

    const membersUrl = `https://api.github.com/teams/${team.id}/members`;
    const members = await getGitHubData(membersUrl);

    const memberPromises = members.map(async (member) => {
      await saveToMongoDB(User, {
        username: member.login,
        avatarUrl: member.avatar_url,
      }, 'username');
    });

    await Promise.all(memberPromises);

    return members;
  } catch (error) {
    console.error(`Error fetching members for team "${teamName}":`, error);
    throw error;
  }
};