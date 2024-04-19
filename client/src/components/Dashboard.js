// client/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  const { organizations, users, repositories, teams } = dashboardData;

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Organizations</h3>
        <ul>
          {organizations.map((org) => (
            <li key={org.name}>{org.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user.username}>{user.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Repositories</h3>
        <ul>
          {repositories.map((repo) => (
            <li key={repo.name}>{repo.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Teams</h3>
        <ul>
          {teams.map((team) => (
            <li key={team.name}>{team.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;