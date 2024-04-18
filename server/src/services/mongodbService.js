// src/services/mongodbService.js
const mongoose = require('mongoose');
const Organization = require('../models/organization');
const User = require('../models/user');
const Project = require('../models/project');
const Repository = require('../models/repository');
const Team = require('../models/team');
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

const saveOrganization = async (orgData) => {
  try {
    const existingOrg = await Organization.findOne({ name: orgData.login });
    if (existingOrg) {
      // Update the existing organization
      existingOrg.description = orgData.description;
      existingOrg.avatarUrl = orgData.avatar_url;
      await existingOrg.save();
    } else {
      // Create a new organization
      const newOrg = new Organization({
        name: orgData.login,
        description: orgData.description,
        avatarUrl: orgData.avatar_url,
      });
      await newOrg.save();
    }
  } catch (error) {
    console.error('Error saving organization data:', error);
  }
};

const saveUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ username: userData.login });
    if (existingUser) {
      // Update the existing user
      existingUser.name = userData.name;
      existingUser.avatarUrl = userData.avatar_url;
      existingUser.company = userData.company;
      existingUser.location = userData.location;
      await existingUser.save();
    } else {
      // Create a new user
      const newUser = new User({
        username: userData.login,
        name: userData.name,
        avatarUrl: userData.avatar_url,
        company: userData.company,
        location: userData.location,
      });
      await newUser.save();
    }
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

const saveRepository = async (repoData) => {
  try {
    const existingRepo = await Repository.findOne({ name: repoData.name });
    if (existingRepo) {
      // Update the existing repository
      existingRepo.description = repoData.description;
      existingRepo.htmlUrl = repoData.html_url;
      await existingRepo.save();
    } else {
      // Create a new repository
      const newRepo = new Repository({
        name: repoData.name,
        description: repoData.description,
        htmlUrl: repoData.html_url,
        organization: config.organizationName,
      });
      await newRepo.save();
    }
  } catch (error) {
    console.error('Error saving repository data:', error);
  }
};

const saveTeam = async (teamData) => {
  try {
    const existingTeam = await Team.findOne({ name: teamData.name });
    if (existingTeam) {
      // Update the existing team
      existingTeam.description = teamData.description;
      await existingTeam.save();
    } else {
      // Create a new team
      const newTeam = new Team({
        name: teamData.name,
        description: teamData.description,
        organization: config.organizationName,
      });
      await newTeam.save();
    }
  } catch (error) {
    console.error('Error saving team data:', error);
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

module.exports = {
  connectToMongoDB,
  saveOrganization,
  saveUser,
  saveRepository,
  saveTeam,
  getOrganizations,
  getUsers,
  getRepositories,
  getTeams,
};