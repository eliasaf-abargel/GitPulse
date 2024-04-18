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
    throw error; // Rethrow the error for better error handling
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
    throw error; // Rethrow the error for better error handling
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
    throw error; // Rethrow the error for better error handling
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
    throw error; // Rethrow the error for better error handling
  }
};

const getOrganizations = async () => {
  try {
    return await Organization.find();
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error; // Rethrow the error for better error handling
  }
};

const getUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Rethrow the error for better error handling
  }
};

const getRepositories = async () => {
  try {
    return await Repository.find();
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error; // Rethrow the error for better error handling
  }
};

const getTeams = async () => {
  try {
    return await Team.find();
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error; // Rethrow the error for better error handling
  }
};

const getUsersInTeam = async (teamName) => {
  try {
    const team = await Team.findOne({ name: teamName });
    if (!team) {
      console.error(`Team "${teamName}" not found`);
      throw new Error(`Team "${teamName}" not found`);
    }

    const members = await User.find({ _id: { $in: team.members } });
    return members;
  } catch (error) {
    console.error(`Error fetching users in team "${teamName}":`, error);
    throw error; // Rethrow the error for better error handling
  }
};

const getRepositoriesInTeam = async (teamName) => {
  try {
    const team = await Team.findOne({ name: teamName });
    if (!team) {
      console.error(`Team "${teamName}" not found`);
      throw new Error(`Team "${teamName}" not found`);
    }

    const repositories = await Repository.find({ _id: { $in: team.repositories } });
    return repositories;
  } catch (error) {
    console.error(`Error fetching repositories in team "${teamName}":`, error);
    throw error; // Rethrow the error for better error handling
  }
};

const getUserByUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    console.error(`Error fetching user by username "${username}":`, error);
    throw error; // Rethrow the error for better error handling
  }
};

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.error(`Error fetching user by email "${email}":`, error);
    throw error; // Rethrow the error for better error handling
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
  getUsersInTeam,
  getRepositoriesInTeam,
  getUserByUsername,
  getUserByEmail,
};