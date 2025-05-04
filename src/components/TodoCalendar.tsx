import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, Plus, ListTodo, Calendar as CalendarIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { type DayProps } from 'react-day-picker';
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}
const TodoCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [newTodoText, setNewTodoText] = useState('');
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([{
    id: '1',
    text: 'Team meeting',
    completed: false,
    date: new Date()
  }, {
    id: '2',
    text: 'Review project proposal',
    completed: true,
    date: new Date()
  }, {
    id: '3',
    text: 'Call with client',
    completed: false,
    date: new Date()
  }]);
  const todaysTodos = todos.filter(todo => todo.date.toDateString() === selectedDate.toDateString());

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
      date: selectedDate
    };
    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };
  const toggleTodoCompletion = (id: string) => {
    setTodos(todos.map(todo => todo.id === id ? {
      ...todo,
      completed: !todo.completed
    } : todo));
  };
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Drag and drop functionality
  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo);
  };
  const handleDragEnd = () => {
    setDraggedTodo(null);
  };
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);

      // If there's a todo being dragged, update its date
      if (draggedTodo) {
        const updatedTodos = todos.map(todo => todo.id === draggedTodo.id ? {
          ...todo,
          date
        } : todo);
        setTodos(updatedTodos);
        setDraggedTodo(null);
      }
    }
  };

  // Custom day render to show task indicators
  const customDayRender = (day: DayProps) => {
    const date = day.date;
    // Check if the current day is selected by comparing dates
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
    const taskCount = getTaskCountForDay(date);
    const dateValue = date.getDate();
    return <div className="relative w-full h-full flex items-center justify-center">
        <div className={cn("flex flex-col items-center justify-center", isSelected && "font-bold")}>
          {dateValue}
          {taskCount > 0 && <Badge variant="secondary" className="absolute -bottom-1 px-1 py-0 min-w-5 h-4 text-[0.65rem] flex items-center justify-center">
              {taskCount}
            </Badge>}
        </div>
      </div>;
  };
  return <div className="fixed top-4 right-4 w-80 z-50">
      <Card className="shadow-lg mx-[69px]">
        <Collapsible open={isCalendarOpen} onOpenChange={setIsCalendarOpen} className="rounded my-0 py-0 bg-transparent mx-[3px] px-0">
          <CardHeader className="p-3 bg-primary/10 py-[13px] my-[5px] mx-[32px] px-[36px]">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar & Tasks
              </CardTitle>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  {isCalendarOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent className="p-3">
              <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} className={cn("rounded-md border", "pointer-events-auto")} components={{
              Day: customDayRender
            }} />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <ListTodo className="h-4 w-4 mr-2" />
                  <h3 className="text-sm font-medium">
                    Tasks for {format(selectedDate, 'MMM d, yyyy')}
                  </h3>
                </div>
                
                <div className="flex space-x-2">
                  <Input placeholder="Add new task..." value={newTodoText} onChange={e => setNewTodoText(e.target.value)} onKeyPress={e => e.key === 'Enter' && addTodo()} className="h-8 text-sm" />
                  <Button onClick={addTodo} size="sm" className="h-8 px-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-1 max-h-36 overflow-y-auto py-1">
                  {todaysTodos.length > 0 ? todaysTodos.map(todo => <div key={todo.id} className="flex items-center justify-between space-x-2 text-sm" draggable onDragStart={() => handleDragStart(todo)} onDragEnd={handleDragEnd} style={{
                  cursor: 'grab'
                }}>
                        <div className="flex items-center space-x-2">
                          <Checkbox id={`todo-${todo.id}`} checked={todo.completed} onCheckedChange={() => toggleTodoCompletion(todo.id)} />
                          <label htmlFor={`todo-${todo.id}`} className={cn("text-sm cursor-pointer", todo.completed && "line-through text-muted-foreground")}>
                            {todo.text}
                          </label>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => deleteTodo(todo.id)}>
                          &times;
                        </Button>
                      </div>) : <div className="text-sm text-muted-foreground text-center py-2">
                      No tasks for today
                    </div>}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>;
};
export default TodoCalendar;