
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Task, Crew } from './ScheduleTypes';
import { cn } from '@/lib/utils';
import { User, Users, MapPin, CheckCircle, Clock, Calendar as CalendarIcon, Plus, Pencil } from 'lucide-react';
import { getCrewDisplayCode } from './ScheduleHelpers';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { DayProps } from 'react-day-picker';

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

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(
    task => task.date.toDateString() === selectedDate.toDateString()
  );

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

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-sm border overflow-hidden">
        <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b p-4 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <div className="flex items-center justify-center p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
              <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            Schedule Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            className={cn("rounded-md border shadow-sm", "calendar-grid")}
            components={{
              DayContent: (props: DayProps) => {
                const dayDate = props.date;
                const hasTasks = tasks.some(
                  task => task.date.toDateString() === dayDate.toDateString()
                );
                
                // Is this date being dragged over
                const isDragOver = dragOverDate && 
                                  dragOverDate.toDateString() === dayDate.toDateString();
                
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
                
                return (
                  <div 
                    className={cn(
                      "calendar-day-cell relative h-full flex items-center justify-center",
                      draggedTaskId && "valid-drop-target"
                    )}
                    onDragOver={handleDayDragOver}
                    onDragLeave={handleDayDragLeave}
                    onDrop={handleDayDrop}
                  >
                    <div className="z-10 font-medium">
                      {format(dayDate, 'd')}
                    </div>
                    {hasTasks && (
                      <div className={cn(
                        "absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full",
                        isDragOver ? "bg-blue-600" : "bg-blue-500"
                      )} />
                    )}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm border overflow-hidden">
        <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b p-4 pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-medium">
              <div className="flex items-center justify-center p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              {format(selectedDate, 'MMMM d, yyyy')}
            </div>
            <Button 
              size="sm" 
              onClick={onAddNewTask}
              className="gap-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Task
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {tasksForSelectedDate.length === 0 ? (
              <div 
                className="empty-day-container rounded-lg py-10 animate-fade-in"
                onClick={onAddNewTask}
              >
                <Plus className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-center">
                  No tasks scheduled for this day<br />
                  <span className="text-sm">Click to add a new task</span>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "task-item flex items-start justify-between p-4 rounded-lg border transition-all duration-200",
                      task.completed ? "completed bg-green-50/50 dark:bg-green-900/10" : "bg-card hover:shadow-sm hover:border-blue-200",
                      "dark:hover:border-blue-800/40"
                    )}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id={`cal-task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => onToggleTaskCompletion(task.id)}
                          className="h-5 w-5 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                        />
                        <span className={cn(
                          "font-medium transition-all", 
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </span>
                        
                        {onEditTask && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 ml-auto rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task.id);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="pl-8 space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-2" />
                          <span>{task.startTime} - {task.endTime}</span>
                        </div>
                        
                        {/* Show assignment info */}
                        {task.assignedTo && (
                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-2" />
                            <span>{task.assignedTo}</span>
                          </div>
                        )}
                        
                        {task.crew && task.crew.length > 0 && (
                          <div className="flex items-center">
                            <Users className="h-3.5 w-3.5 mr-2" />
                            <span>
                              Crew {task.crewId ? getCrewDisplayCode(task.crewId, crews) : ''}
                            </span>
                            
                            <div className="flex -space-x-1 ml-2">
                              {task.crew.slice(0, 3).map((member, i) => (
                                <Avatar key={i} className="h-5 w-5 border border-background">
                                  <AvatarFallback className="text-[0.6rem] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                    {member.substring(0, 1)}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {task.crew.length > 3 && (
                                <Badge variant="secondary" className="h-5 w-5 rounded-full flex items-center justify-center text-[0.6rem] p-0">
                                  +{task.crew.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Show location info */}
                        {task.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-2" />
                            <span>{task.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Badge 
                      variant={task.completed ? "outline" : "secondary"}
                      className={cn(
                        "ml-2 text-xs whitespace-nowrap",
                        task.completed ? "bg-green-50 text-green-700 border-green-200 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300" : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      )}
                    >
                      {task.completed ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {task.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendarView;
