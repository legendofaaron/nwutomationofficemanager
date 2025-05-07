
import React from 'react';

const ScheduleGuide: React.FC = () => {
  return (
    <div className="mt-6 border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
      <h3 className="font-medium text-lg mb-2 text-blue-700 dark:text-blue-400">Scheduling Guide</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col gap-2">
          <div className="font-medium text-blue-800 dark:text-blue-300">Individual Tasks</div>
          <p className="text-blue-700 dark:text-blue-400">Assign tasks to specific employees with the "Employee Task" button.</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium text-blue-800 dark:text-blue-300">Crew Tasks</div>
          <p className="text-blue-700 dark:text-blue-400">Schedule tasks for entire crews with the "Crew Task" button.</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium text-blue-800 dark:text-blue-300">Client Visits</div>
          <p className="text-blue-700 dark:text-blue-400">Use "Client Visit" to send a crew to a client's location.</p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGuide;
