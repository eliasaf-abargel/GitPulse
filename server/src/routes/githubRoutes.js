// server/src/routes/githubRoutes.js
const express = require('express');
const githubRotuers = require ('express').Router();
const githubController = require('../controllers/githubController');
const { getRepositories,getRepositoryByName,getUserInfo,getUserOrganizations } = require('../controllers/githubController');


// Get authenticated user's repositories
githubRotuers.get('/user/repos', getRepositories);

// Get a specific repository by name
githubRotuers.get('/repos/:owner/:repoName',getRepositoryByName);

// Get information about a specific user
githubRotuers.get('/users/:username', getUserInfo);

// Get organizations for a specific user
githubRotuers.get('/users/:username/orgs', getUserOrganizations);

// Get the authenticated user's organization and its members
githubRotuers.get('/organization/members', githubController.getOrganizationMembers);

// Get repositories for a specific organization
githubRotuers.get('/organizations/:orgName/repos', githubController.getOrganizationRepositories);

// Get teams for a specific organization
githubRotuers.get('/organizations/:orgName/teams', githubController.getOrganizationTeams);

// Get members for a specific team
githubRotuers.get('/organizations/:orgName/teams/:teamName/members', githubController.getTeamMembers);

// Get repositories for a specific team
githubRotuers.get('/organizations/:orgName/teams/:teamName/repos', githubController.getTeamRepositories);

// Get a specific organization by name
githubRotuers.get('/organizations/:orgName', githubController.getOrganizationByName);

// Get members of a specific organization
githubRotuers.get('/organizations/:orgName/members', githubController.getOrganizationMembersByName);

// Get teams of a specific organization
githubRotuers.get('/organizations/:orgName/teams', githubController.getOrganizationTeamsByName);

// Get members of a specific team in an organization
githubRotuers.get('/organizations/:orgName/teams/:teamSlug/members', githubController.getTeamMembersByName);

// Get repositories of a specific team in an organization
module.exports = githubRotuers;