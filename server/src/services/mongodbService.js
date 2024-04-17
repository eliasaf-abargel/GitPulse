// server/src/services/mongodbService.js
const Organization = require('../models/organization');
const User = require('../models/user');
const Repository = require('../models/repository');
const Team = require('../models/team');
const config = require('../config/config');

exports.saveOrganization = async (orgData) => {
  const existingOrg = await Organization.findOne({ name: orgData.login });
  if (!existingOrg) {
    const newOrg = new Organization({
      name: orgData.login,
      description: orgData.description,
      avatarUrl: orgData.avatar_url,
    });
    await newOrg.save();
  }
};

exports.saveUser = async (userData) => {
  const existingUser = await User.findOne({ username: userData.login });
  if (!existingUser) {
    const newUser = new User({
      username: userData.login,
      name: userData.name,
      avatarUrl: userData.avatar_url,
      company: userData.company,
      location: userData.location,
    });
    await newUser.save();
  }
};

exports.saveRepository = async (repoData) => {
  const existingRepo = await Repository.findOne({ name: repoData.name });
  if (!existingRepo) {
    const newRepo = new Repository({
      name: repoData.name,
      description: repoData.description,
      html_url: repoData.html_url,
      organization: config.organizationName,
    });
    await newRepo.save();
  }
};

exports.saveTeam = async (teamData) => {
  const existingTeam = await Team.findOne({ name: teamData.name });
  if (!existingTeam) {
    const newTeam = new Team({
      name: teamData.name,
      description: teamData.description,
      organization: config.organizationName,
    });
    await newTeam.save();
  }
};

exports.getOrganizations = async () => {
  return await Organization.find();
};

exports.getUsers = async () => {
  return await User.find();
};

exports.getRepositories = async () => {
  return await Repository.find();
};

exports.getTeams = async () => {
  return await Team.find();
};