import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Task, Crew } from './ScheduleTypes';
import { cn } from '@/lib/utils';
import { User, Users, MapPin, CheckCircle, Clock, CalendarIcon, Calendar as CalendarIcon2, Plus, Pencil, CalendarCheck } from 'lucide-react';
import { getCrewDisplayCode } from './ScheduleHelpers';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths } from 'date-fns';
import { DayProps } from 'react-day-picker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface TaskCalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  onToggleTaskCompletion: (taskId: string) => void;
  crews: Crew[];
  onAddNewTask: () => void;
  onMoveTask?: (taskId: string, newDate: Date) => void;
  onEditTask?: (taskId: string) => void;
}
const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({
  tasks,
  selectedDate,
  onSelectDate,
  onToggleTaskCompletion,
  crews,
  onAddNewTask,
  onMoveTask,
  onEditTask
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());

  // Effect to add/remove dragging class on body
  useEffect(() => {
    if (draggedTaskId) {
      document.body.classList.add('dragging');
    } else {
      document.body.classList.remove('dragging');
    }

    // Cleanup function to ensure class is removed
    return () => {
      document.body.classList.remove('dragging');
    };
  }, [draggedTaskId]);

  // Effect to update currentMonth when selectedDate changes significantly (different month)
  useEffect(() => {
    if (selectedDate && (selectedDate.getMonth() !== currentMonth.getMonth() || selectedDate.getFullYear() !== currentMonth.getFullYear())) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate, currentMonth]);

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => task.date.toDateString() === selectedDate.toDateString());

  // Count tasks by status
  const completedTasks = tasksForSelectedDate.filter(task => task.completed).length;
  const pendingTasks = tasksForSelectedDate.length - completedTasks;

  // Handle task drag start
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    // Set data for drag operation
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'task',
      id: task.id,
      title: task.title
    }));

    // Prevent ghost image from being too large
    const dragIcon = document.createElement('div');
    dragIcon.classList.add('drag-icon');
    dragIcon.textContent = task.title || '';
    dragIcon.style.position = 'absolute';
    dragIcon.style.top = '-1000px';
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 0, 0);

    // Add a small timeout to remove the element
    setTimeout(() => {
      document.body.removeChild(dragIcon);
    }, 0);

    // Store dragged task id in state
    setDraggedTaskId(task.id);

    // Add dragging class for visual feedback
    const element = e.currentTarget as HTMLElement;
    element.classList.add('dragging');
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('dragging');
    setDraggedTaskId(null);
    setDragOverDate(null);
  };
  return <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-md border rounded-xl overflow-hidden">
        <CardHeader className="bg-card border-b p-5 space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <div className="flex items-center justify-center p-1.5 rounded-md bg-primary/10 dark:bg-primary/20">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            Schedule Calendar
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Drag tasks to reschedule or select a date to view details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Calendar mode="single" selected={selectedDate} onSelect={onSelectDate} month={currentMonth} onMonthChange={setCurrentMonth} className={cn("rounded-xl border shadow-sm", "calendar-grid")} components={{
          DayContent: (props: DayProps) => {
            const dayDate = props.date;
            const dayTasks = tasks.filter(task => task.date.toDateString() === dayDate.toDateString());
            const hasTasks = dayTasks.length > 0;
            const hasCompletedTasks = dayTasks.some(task => task.completed);
            const hasPendingTasks = dayTasks.some(task => !task.completed);

            // Is this date being dragged over
            const isDragOver = dragOverDate && dragOverDate.toDateString() === dayDate.toDateString();

            // Event handlers for day cells
            const handleDayDragOver = (e: React.DragEvent) => {
              e.preventDefault();
              e.stopPropagation();
              if (draggedTaskId) {
                setDragOverDate(dayDate);
                // Add visual feedback class
                const cell = e.currentTarget.closest('.rdp-cell');
                if (cell) {
                  cell.classList.add('drag-over');
                }
              }
            };
            const handleDayDragLeave = (e: React.DragEvent) => {
              e.preventDefault();
              e.stopPropagation();
              // Remove visual feedback
              const cell = e.currentTarget.closest('.rdp-cell');
              if (cell) {
                cell.classList.remove('drag-over');
              }
              if (dragOverDate && dragOverDate.toDateString() === dayDate.toDateString()) {
                setDragOverDate(null);
              }
            };
            const handleDayDrop = (e: React.DragEvent) => {
              e.preventDefault();
              e.stopPropagation();

              // Remove visual feedback
              const cell = e.currentTarget.closest('.rdp-cell');
              if (cell) {
                cell.classList.remove('drag-over');
              }
              try {
                const data = e.dataTransfer.getData('application/json');
                if (data && onMoveTask) {
                  const dragData = JSON.parse(data);
                  if (dragData.type === 'task' && dragData.id) {
                    // Get the task being moved
                    const taskToMove = tasks.find(t => t.id === dragData.id);

                    // Only proceed with move if day is different or if same day, only update UI
                    if (taskToMove) {
                      const isSameDay = taskToMove.date.toDateString() === dayDate.toDateString();
                      if (!isSameDay) {
                        // Different day, proceed with actual move
                        onMoveTask(dragData.id, dayDate);
                      } else {
                        // Same day, just cleanup UI but don't trigger move
                        console.log("Task dropped on same day, no move needed");
                      }
                    } else {
                      onMoveTask(dragData.id, dayDate);
                    }
                  }
                }
              } catch (error) {
                console.error('Error handling day drop:', error);
              }
              setDragOverDate(null);
            };
            return <div className={cn("calendar-day-cell relative h-full flex items-center justify-center", draggedTaskId && "valid-drop-target", dayDate.toDateString() === selectedDate?.toDateString() && "selected-day")} onDragOver={handleDayDragOver} onDragLeave={handleDayDragLeave} onDrop={handleDayDrop}>
                    <div className="z-10 font-medium">
                      {format(dayDate, 'd')}
                    </div>
                    
                    {/* Show task indicators */}
                    {hasTasks && <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-0.5">
                        {hasPendingTasks && <div className="h-1 w-1 rounded-full bg-blue-500" />}
                        {hasCompletedTasks && <div className="h-1 w-1 rounded-full bg-green-500" />}
                      </div>}
                  </div>;
          }
        }} />
        </CardContent>
      </Card>
      
      <Card className="shadow-md border rounded-xl overflow-hidden">
        <CardHeader className="bg-card border-b p-5 space-y-0">
          <div className="flex items-center justify-between mb-1">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <div className="flex items-center justify-center p-1.5 rounded-md bg-primary/10 dark:bg-primary/20">
                <CalendarCheck className="h-5 w-5 text-primary" />
              </div>
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={onAddNewTask} className="gap-1.5 px-3 bg-primary hover:bg-primary/90 text-gray-900">
                    <Plus className="h-3.5 w-3.5" />
                    Add Task
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add a new task for this day</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex gap-3">
            {pendingTasks > 0 && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40">
                <Clock className="h-3 w-3 mr-1" />
                {pendingTasks} Pending
              </Badge>}
            {completedTasks > 0 && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/40">
                <CheckCircle className="h-3 w-3 mr-1" />
                {completedTasks} Completed
              </Badge>}
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
            {tasksForSelectedDate.length === 0 ? <div className="empty-day-container rounded-xl py-10 animate-fade-in" onClick={onAddNewTask}>
                <div className="p-3 bg-muted/30 rounded-full mb-3 mx-auto w-fit">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-center">
                  No tasks scheduled for this day<br />
                  <span className="text-sm">Click to add a new task</span>
                </p>
              </div> : <div className="space-y-3">
                {tasksForSelectedDate.map(task => <div key={task.id} className={cn("task-item flex items-start justify-between p-4 rounded-lg border transition-all duration-200", task.completed ? "completed bg-green-50/80 dark:bg-green-900/10 border-green-100 dark:border-green-900/30" : "bg-card hover:shadow-sm border-blue-100/60 dark:border-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/40")} draggable onDragStart={e => handleDragStart(e, task)} onDragEnd={handleDragEnd}>
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                          <Checkbox id={`cal-task-${task.id}`} checked={task.completed} onCheckedChange={() => onToggleTaskCompletion(task.id)} className={cn("h-5 w-5 transition-colors", task.completed ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" : "data-[state=checked]:bg-primary data-[state=checked]:border-primary")} />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <span className={cn("font-medium block truncate max-w-full transition-all", task.completed && "line-through text-muted-foreground")}>
                            {task.title}
                          </span>
                          
                          <div className="space-y-1.5 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                              <span>{task.startTime} - {task.endTime}</span>
                            </div>
                            
                            {/* Show assignment info */}
                            {task.assignedTo && <div className="flex items-center">
                                <User className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                <span className="truncate">{task.assignedTo}</span>
                              </div>}
                            
                            {task.crew && task.crew.length > 0 && <div className="flex items-center">
                                <Users className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                <span className="truncate">
                                  Crew {task.crewId ? getCrewDisplayCode(task.crewId, crews) : ''}
                                </span>
                                
                                <div className="flex -space-x-1 ml-2">
                                  {task.crew.slice(0, 3).map((member, i) => <Avatar key={i} className="h-5 w-5 border border-background">
                                      <AvatarFallback className="text-[0.6rem] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                        {member.substring(0, 1)}
                                      </AvatarFallback>
                                    </Avatar>)}
                                  {task.crew.length > 3 && <Badge variant="secondary" className="h-5 w-5 rounded-full flex items-center justify-center text-[0.6rem] p-0">
                                      +{task.crew.length - 3}
                                    </Badge>}
                                </div>
                              </div>}
                            
                            {/* Show location info */}
                            {task.location && <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                <span className="truncate">{task.location}</span>
                              </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-3">
                      <Badge variant={task.completed ? "outline" : "secondary"} className={cn("text-xs whitespace-nowrap", task.completed ? "bg-green-50 text-green-700 border-green-200 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300" : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300")}>
                        {task.completed ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {task.completed ? 'Completed' : 'Pending'}
                      </Badge>
                      
                      {onEditTask && <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => onEditTask(task.id)}>
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>}
                    </div>
                  </div>)}
              </div>}
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default TaskCalendarView;