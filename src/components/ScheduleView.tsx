
import React from 'react';
import ScheduleView from './schedule/ScheduleView';
import { DragDropProvider } from './schedule/DragDropContext';

// Enhanced version with drag/drop context wrapper
export default () => (
  <DragDropProvider>
    <ScheduleView />
  </DragDropProvider>
);
