
import React, { memo } from 'react';
import ScheduleView from './schedule/ScheduleView';
import { DragDropProvider } from './schedule/DragDropContext';

// Enhanced version with drag/drop context wrapper
const ScheduleViewWrapper = memo(() => (
  <div className="optimize-gpu">
    <DragDropProvider>
      <ScheduleView />
    </DragDropProvider>
  </div>
));

ScheduleViewWrapper.displayName = 'ScheduleViewWrapper';

export default ScheduleViewWrapper;
