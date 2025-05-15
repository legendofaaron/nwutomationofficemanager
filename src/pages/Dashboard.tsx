
import React from 'react';

const Dashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="mb-6 text-muted-foreground">
        Welcome to your dashboard. From here you can access all your scheduling features.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a href="/schedule" className="block p-3 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors">
              Schedule Builder
            </a>
            <a href="/settings" className="block p-3 bg-primary/10 hover:bg-primary/20 rounded-md transition-colors">
              Settings
            </a>
          </div>
        </div>
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
