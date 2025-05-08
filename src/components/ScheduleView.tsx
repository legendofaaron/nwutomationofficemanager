
import React, { memo } from 'react';
import ScheduleView from './schedule/ScheduleView';
import { DragDropProvider } from './schedule/DragDropContext';

// Enhanced version with drag/drop context wrapper and performance optimizations
const ScheduleViewWrapper = memo(() => (
  <div className="optimize-gpu transition-all-no-flicker">
    <DragDropProvider>
      <ScheduleView />
    </DragDropProvider>
  </div>
));

ScheduleViewWrapper.displayName = 'ScheduleViewWrapper';

export default ScheduleViewWrapper;
