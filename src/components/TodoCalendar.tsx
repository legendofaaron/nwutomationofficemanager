import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronDown, ChevronUp, Plus, ListTodo, 
  Calendar as CalendarIcon, Download, X, 
  FileText, FileDown
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type DayProps } from 'react-day-picker';
import { toast } from 'sonner';
import { downloadScheduleAsPdf, downloadScheduleAsTxt } from '@/utils/downloadUtils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
  assignedTo?: string;
  crewMembers?: string[];
  crewId?: string;
  crewName?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
}

// Define a function to convert Todos to Tasks format for download utilities
const convertTodosToTasks = (todos: Todo[]) => {
  return todos.map(todo => ({
    id: todo.id,
    title: todo.text, // Map text to title
    date: todo.date,
    completed: todo.completed,
    assignedTo: todo.assignedTo || '',
    crew: todo.crewMembers || [],
    crewId: todo.crewId || '',
    crewName: todo.crewName || '',
    startTime: todo.startTime || '09:00',
    endTime: todo.endTime || '10:00',
    location: todo.location || '',
    description: '',
  }));
};

const TodoCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [newTodoText, setNewTodoText] = useState('');
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const dragImageRef = useRef<HTMLDivElement | null>(null);
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Team meeting', completed: false, date: new Date(), startTime: '10:00', endTime: '11:00' },
    { id: '2', text: 'Review project proposal', completed: true, date: new Date(), startTime: '13:00', endTime: '14:00' },
    { id: '3', text: 'Call with client', completed: false, date: new Date(), startTime: '15:00', endTime: '16:00' },
  ]);

  // Create drag image element on mount
  useEffect(() => {
    const dragImage = document.createElement('div');
    dragImage.className = 'task-drag-preview';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    
    dragImageRef.current = dragImage;
    
    return () => {
      if (dragImage && document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    };
  }, []);

  const todaysTodos = todos.filter(
    todo => todo.date.toDateString() === selectedDate.toDateString()
  );

  // Count tasks for each day
  const getTaskCountForDay = (date: Date): number => {
    return todos.filter(todo => todo.date.toDateString() === date.toDateString()).length;
  };

  const addTodo = () => {
    if (newTodoText.trim() === '') return;
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText,
      completed: false,
      date: selectedDate,
      startTime: '09:00',
      endTime: '10:00'
    };
    
    setTodos([...todos, newTodo]);
    setNewTodoText('');
    toast.success("Task added successfully");
  };

  const toggleTodoCompletion = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success("Task removed");
  };

  // Handle downloading schedule
  const handleDownloadSchedule = (format: 'pdf' | 'text') => {
    try {
      // Convert todos to tasks format required by download utilities
      const tasks = convertTodosToTasks(todos);
      
      if (format === 'pdf') {
        downloadScheduleAsPdf(tasks);
      } else {
        downloadScheduleAsTxt(tasks);
      }
      toast.success(`Schedule downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error downloading schedule:', error);
      toast.error("Failed to download schedule");
    }
    setDownloadMenuOpen(false);
  };

  // Enhanced drag and drop functionality
  const handleDragStart = (todo: Todo, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedTodo(todo);
    setIsDragging(true);
    
    // Set drag effect and image
    e.dataTransfer.effectAllowed = "move";
    
    // Use our ref for the drag image
    if (dragImageRef.current) {
      dragImageRef.current.textContent = todo.text;
      dragImageRef.current.className = 'bg-primary text-white px-2 py-1 rounded text-xs';
      document.body.appendChild(dragImageRef.current);
      e.dataTransfer.setDragImage(dragImageRef.current, 10, 10);
    }
    
    // Set data transfer
    const stringifiedData = JSON.stringify({
      id: todo.id,
      text: todo.text,
      type: 'todo',
      originalData: todo
    });
    
    e.dataTransfer.setData('application/json', stringifiedData);
    e.dataTransfer.setData('text/plain', todo.text);
  };

  const handleDragEnd = () => {
    setDraggedTodo(null);
    setIsDragging(false);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      
      // If there's a todo being dragged, update its date
      if (draggedTodo) {
        const updatedTodos = todos.map(todo => 
          todo.id === draggedTodo.id 
            ? { ...todo, date } 
            : todo
        );
        setTodos(updatedTodos);
        setDraggedTodo(null);
        toast.success(`Task moved to ${format(date, 'MMM d, yyyy')}`);
      }
    }
  };

  // Custom day render to show task indicators and handle drops
  const customDayRender = (day: DayProps) => {
    const date = day.date;
    if (!date) return null;
    
    // Check if the current day is selected
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const taskCount = getTaskCountForDay(date);
    const dateValue = date.getDate();
    
    // Create a custom styling for the day cell that looks like the image
    return (
      <div 
        className={cn(
          "relative w-full h-full flex items-center justify-center",
          isDragging && "cursor-copy drop-shadow-sm",
          isSelected && "bg-[#444444] rounded-full",
          "hover:bg-[#333333] transition-colors cursor-pointer rounded-full"
        )}
        onClick={() => setSelectedDate(date)}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.currentTarget) {
            e.currentTarget.classList.add("bg-[#333333]");
          }
        }}
        onDragLeave={(e) => {
          if (e.currentTarget) {
            e.currentTarget.classList.remove("bg-[#333333]");
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          
          if (e.currentTarget) {
            e.currentTarget.classList.remove("bg-[#333333]");
          }
          
          if (draggedTodo) {
            const updatedTodos = todos.map(todo => 
              todo.id === draggedTodo.id 
                ? { ...todo, date } 
                : todo
            );
            setTodos(updatedTodos);
            setDraggedTodo(null);
            setIsDragging(false);
            setSelectedDate(date);
            toast.success(`Task moved to ${format(date, 'MMM d, yyyy')}`);
          }
          
          // Add support for other dragged items from dashboard
          try {
            const data = e.dataTransfer.getData("application/json");
            if (data) {
              const item = JSON.parse(data);
              if (item.type === 'booking' || item.type === 'employee' || item.type === 'crew' || item.type === 'todo') {
                const newTodo: Todo = {
                  id: Date.now().toString(),
                  text: item.text || "New task",
                  completed: false,
                  date: date,
                  assignedTo: item.originalData?.assignedTo || item.originalData?.name,
                };
                
                setTodos([...todos, newTodo]);
                toast.success(`Item added to calendar on ${format(date, 'MMM d, yyyy')}`);
              }
            }
          } catch (error) {
            console.error("Error processing drop:", error);
          }
        }}
      >
        <div className={cn(
          "flex flex-col items-center justify-center text-lg font-medium",
          "text-white" // Always make text white, regardless of selection state
        )}>
          {dateValue}
          {taskCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute -bottom-0 px-1.5 py-0 min-w-5 h-5 text-[0.65rem] flex items-center justify-center bg-[#3366FF]/70 text-white rounded-full"
            >
              {taskCount}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed top-20 sm:top-24 right-4 sm:right-6 z-40 w-80">
      <Card className="shadow-xl bg-[#1A1A1A] border-2 rounded-xl border-[#333333] overflow-hidden">
        <Collapsible defaultOpen={true}>
          <CardHeader className="p-3 bg-[#222222] flex flex-row items-center justify-between space-y-0 border-b border-[#333333]">
            <CardTitle className="text-base flex items-center text-[#EEEEEE]">
              <CalendarIcon className="h-5 w-5 mr-2 text-[#3366FF]" />
              Calendar & Tasks
            </CardTitle>
            <div className="flex items-center gap-2">
              <Popover open={downloadMenuOpen} onOpenChange={setDownloadMenuOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    <Download className="h-4 w-4 text-[#AAAAAA]" />
                    <span className="sr-only">Download Schedule</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="left" className="w-56 p-2 bg-[#222222] border-[#333333]">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium mb-2 text-[#DDDDDD]">Download Schedule</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownloadSchedule('text')} 
                      className="w-full justify-start text-sm bg-[#2A2A2A] border-[#444444] text-[#DDDDDD]"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Download as Text
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDownloadSchedule('pdf')} 
                      className="w-full justify-start text-sm bg-[#2A2A2A] border-[#444444] text-[#DDDDDD]"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Download as PDF
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-full text-[#AAAAAA]">
                  {isCalendarOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent className="p-3 bg-[#222222]">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className={cn("rounded-md border-none shadow-sm", "pointer-events-auto")}
                components={{
                  Day: customDayRender
                }}
              />
              
              <div className="mt-4 space-y-2 bg-[#222222]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center text-[#DDDDDD]">
                    <ListTodo className="h-4 w-4 mr-2 text-[#3366FF]" />
                    Tasks for {format(selectedDate, 'MMM d, yyyy')}
                  </h3>
                  <Badge variant="outline" className="text-xs text-[#AAAAAA] border-[#444444] bg-[#2A2A2A]">
                    {todaysTodos.length} {todaysTodos.length === 1 ? 'task' : 'tasks'}
                  </Badge>
                </div>
                
                <div className="flex space-x-1">
                  <Input
                    placeholder="Add new task..."
                    value={newTodoText}
                    onChange={(e) => setNewTodoText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    className="h-10 text-sm bg-[#1A1A1A] border-[#444444] text-[#DDDDDD] rounded-l-lg"
                  />
                  <Button 
                    onClick={addTodo} 
                    size="sm" 
                    className="h-10 px-3 bg-[#2E71F0] hover:bg-[#3366FF] rounded-r-lg"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="space-y-1 max-h-60 overflow-y-auto py-1 rounded-md">
                  {todaysTodos.length > 0 ? (
                    todaysTodos.map((todo) => (
                      <div 
                        key={todo.id} 
                        className={cn(
                          "flex items-center justify-between space-x-2 text-sm bg-[#2A2A2A] rounded-md p-2 border",
                          todo.completed ? "border-green-500/20 bg-green-950/10" : "border-[#444444]"
                        )}
                        draggable
                        onDragStart={(e) => handleDragStart(todo, e)}
                        onDragEnd={handleDragEnd}
                        style={{ cursor: 'grab' }}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <Checkbox 
                            id={`todo-${todo.id}`}
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodoCompletion(todo.id)}
                            className={cn(
                              "rounded-full", 
                              todo.completed ? "bg-green-600 text-white border-transparent" : "border-[#555555]"
                            )}
                          />
                          <div className="flex flex-col min-w-0">
                            <label
                              htmlFor={`todo-${todo.id}`}
                              className={cn(
                                "text-sm cursor-pointer truncate",
                                todo.completed ? "line-through text-[#888888]" : "text-[#EEEEEE]"
                              )}
                            >
                              {todo.text}
                            </label>
                            {(todo.startTime || todo.endTime) && (
                              <span className="text-xs text-[#888888]">
                                {todo.startTime} - {todo.endTime}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full hover:bg-[#444444]"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <X className="h-3.5 w-3.5 text-[#999999]" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-[#888888] text-center py-4 bg-[#1A1A1A] rounded-md border border-dashed border-[#333333]">
                      No tasks for today
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default TodoCalendar;
