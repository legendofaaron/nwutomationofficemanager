
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Task, Crew } from './ScheduleTypes';
import { cn } from '@/lib/utils';
import { User, Users, MapPin, CheckCircle, Clock, CalendarIcon, Calendar as CalendarIcon2, Plus, Pencil, CalendarCheck, MoveHorizontal } from 'lucide-react';
import { getCrewDisplayCode } from './ScheduleHelpers';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths } from 'date-fns';
import { DayProps } from 'react-day-picker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import DraggableItem from './DraggableItem';
import DroppableArea from './DroppableArea';
import { useDragDrop } from './DragDropContext';
import { formatMonthAndYear } from '@/components/calendar/CalendarUtils';

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
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const { isDragging, setIsDragging, draggedItemId, setDraggedItemId, draggedItemType, setDraggedItemType, draggedItemData, setDraggedItemData } = useDragDrop();

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
  const handleDragStart = (data: any, event: React.DragEvent) => {
    setIsDragging(true);
    setDraggedItemId(data.id);
    setDraggedItemType('task');
    setDraggedItemData(data);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItemId(null);
    setDraggedItemType(null);
    setDraggedItemData(null);
  };

  // Handle dropping a task on a day
  const handleDayDrop = (data: any, event: React.DragEvent, date: Date) => {
    if (data.type === 'task' && onMoveTask) {
      onMoveTask(data.id, date);
      toast.success(`Task rescheduled to ${format(date, 'MMMM d')}`, {
        description: data.title
      });
    }
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    setCurrentMonth(prevMonth);
    // If onMonthChange is supported by the calendar component
    // this ensures the internal state is also updated
    onMonthChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    setCurrentMonth(nextMonth);
    // If onMonthChange is supported by the calendar component
    // this ensures the internal state is also updated
    onMonthChange(nextMonth);
  };

  // Add a function to be called when calendar's month changes internally
  const onMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    // No need to update selected date - we just want to view a different month
  };

  return <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-md border rounded-xl overflow-hidden">
        <CardHeader className="bg-card border-b p-5 space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <div className="flex items-center justify-center p-1.5 rounded-md bg-primary/10 dark:bg-primary/20">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              Schedule Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePreviousMonth}
                className="h-7 w-7 p-0"
                type="button"
              >
                ←
              </Button>
              <span className="text-sm font-medium">
                {formatMonthAndYear(currentMonth)}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNextMonth}
                className="h-7 w-7 p-0"
                type="button"
              >
                →
              </Button>
            </div>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Drag tasks to reschedule or select a date to view details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Calendar 
            mode="single" 
            selected={selectedDate} 
            onSelect={onSelectDate} 
            month={currentMonth} 
            onMonthChange={onMonthChange} 
            className={cn("rounded-xl border shadow-sm", "calendar-grid")} 
            components={{
              DayContent: (props: DayProps) => {
                const dayDate = props.date;
                const dayTasks = tasks.filter(task => task.date.toDateString() === dayDate.toDateString());
                const hasTasks = dayTasks.length > 0;
                const hasCompletedTasks = dayTasks.some(task => task.completed);
                const hasPendingTasks = dayTasks.some(task => !task.completed);

                return (
                  <DroppableArea
                    id={`day-${dayDate.toISOString()}`}
                    acceptTypes={['task']}
                    onDrop={(data, event) => handleDayDrop(data, event, dayDate)}
                    className={cn(
                      "calendar-day-cell relative h-full flex items-center justify-center", 
                      dayDate.toDateString() === selectedDate?.toDateString() && "selected-day",
                      hasTasks && "font-medium"
                    )}
                    activeClassName="bg-blue-100 dark:bg-blue-800/30 border-dashed border-blue-400"
                  >
                    {/* Day number */}
                    <div className={cn(
                      "z-10 font-medium",
                      dayDate.toDateString() === new Date().toDateString() && 
                      "bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center"
                    )}>
                      {format(dayDate, 'd')}
                    </div>
                    
                    {/* Task indicators */}
                    {hasTasks && (
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5 pb-0.5">
                        {hasPendingTasks && <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />}
                        {hasCompletedTasks && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
                        
                        {/* If there are many tasks, show a count */}
                        {dayTasks.length > 2 && (
                          <span className="text-[0.6rem] text-muted-foreground absolute -bottom-1 left-1/2 transform -translate-x-1/2 font-normal">
                            {dayTasks.length}
                          </span>
                        )}
                      </div>
                    )}
                  </DroppableArea>
                );
              }
            }} 
          />
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
                  <Button size="sm" onClick={onAddNewTask} className="gap-1.5 px-3 bg-primary hover:bg-primary/90 text-primary-foreground">
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
            {tasksForSelectedDate.length === 0 ? (
              <div className="empty-day-container rounded-xl py-10 animate-fade-in" onClick={onAddNewTask}>
                <div className="p-3 bg-muted/30 rounded-full mb-3 mx-auto w-fit">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-center">
                  No tasks scheduled for this day<br />
                  <span className="text-sm">Click to add a new task</span>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasksForSelectedDate.map(task => (
                  <DraggableItem
                    key={task.id}
                    id={task.id}
                    type="task"
                    data={{ 
                      ...task, 
                      title: task.title 
                    }}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "task-item flex items-start justify-between p-4 rounded-lg border transition-all duration-200",
                      task.completed 
                        ? "completed bg-green-50/80 dark:bg-green-900/10 border-green-100 dark:border-green-900/30" 
                        : "bg-card hover:shadow-sm border-blue-100/60 dark:border-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/40"
                    )}
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5">
                          <Checkbox 
                            id={`cal-task-${task.id}`} 
                            checked={task.completed} 
                            onCheckedChange={() => onToggleTaskCompletion(task.id)} 
                            className={cn(
                              "h-5 w-5 transition-colors",
                              task.completed 
                                ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" 
                                : "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            )} 
                          />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <span className={cn(
                            "font-medium block truncate max-w-full transition-all",
                            task.completed && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </span>
                          
                          <div className="space-y-1.5 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                              <span>{task.startTime} - {task.endTime}</span>
                            </div>
                            
                            {/* Show assignment info */}
                            {task.assignedTo && (
                              <div className="flex items-center">
                                <User className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                <span className="truncate">{task.assignedTo}</span>
                              </div>
                            )}
                            
                            {task.crew && task.crew.length > 0 && (
                              <div className="flex items-center">
                                <Users className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                <span className="truncate">
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
                                <MapPin className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                                <span className="truncate">{task.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-3">
                      <Badge 
                        variant={task.completed ? "outline" : "secondary"} 
                        className={cn(
                          "text-xs whitespace-nowrap",
                          task.completed 
                            ? "bg-green-50 text-green-700 border-green-200 dark:border-green-900 dark:bg-green-900/20 dark:text-green-300" 
                            : "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        )}
                      >
                        {task.completed ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {task.completed ? 'Completed' : 'Pending'}
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        {!task.completed && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                >
                                  <MoveHorizontal className="h-3.5 w-3.5 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="text-xs">
                                <p>Drag to reschedule</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        
                        {onEditTask && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" 
                            onClick={() => onEditTask(task.id)}
                          >
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </DraggableItem>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>;
};

export default TaskCalendarView;
