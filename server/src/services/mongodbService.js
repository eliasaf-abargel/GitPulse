const mongoose = require('mongoose');
const Organization = require('../models/organization');
const User = require('../models/user');
const Team = require('../models/team');
const Project = require('../models/project');
const Repository = require('../models/repository');
const config = require('../config/config');

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const getOrganizations = async () => {
  try {
    return await Organization.find();
  } catch (error) {
    throw error;
  }
};

const getUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw error;
  }
};

const getRepositories = async () => {
  try {
    return await Repository.find();
  } catch (error) {
    throw error;
  }
};

const getTeams = async () => {
  try {
    return await Team.find();
  } catch (error) {
    throw error;
  }
};

const saveOrganization = async (orgData) => {
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

const saveUser = async (userData) => {
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

const saveRepository = async (repoData) => {
  const existingRepo = await Repository.findOne({ name: repoData.name });
  if (!existingRepo) {
    const newRepo = new Repository({
      name: repoData.name,
      description: repoData.description,
      htmlUrl: repoData.html_url,
      organization: config.organizationName,
    });
    await newRepo.save();
  }
};

const saveTeam = async (teamData) => {
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

module.exports = {
  connectToMongoDB,
  getOrganizations,
  getUsers,
  getRepositories,
  getTeams,
  saveOrganization,
  saveUser,
  saveRepository,
  saveTeam,
};