
import React from 'react';
import { SimpleScheduler } from '@/components/schedule/SimpleScheduler';

const SchedulePage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Schedule Builder</h1>
      <p className="mb-6 text-muted-foreground">
        Create and manage your schedule with our intuitive drag-and-drop interface. 
        Add tasks, set times, and easily organize your day by dragging tasks between dates.
      </p>
      <SimpleScheduler />
    </div>
  );
};

export default SchedulePage;
