import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Calendar as CalendarIcon, Clock, Check, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  date: Date;
  time?: string;
  completed: boolean;
}

export function SimpleScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  
  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => 
    task.date.toDateString() === selectedDate.toDateString()
  );
  
  // Add a new task
  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") {
      toast.error("Task title cannot be empty");
      return;
    }
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      date: selectedDate,
      time: newTaskTime || undefined,
      completed: false
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskTime("");
    setIsDialogOpen(false);
    toast.success("Task added successfully");
  };
  
  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Delete a task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.info("Task deleted");
  };
  
  // Handle drag start
  const handleDragStart = (task: Task, e: React.DragEvent) => {
    setDraggingTask(task);
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  };
  
  // Handle drop on calendar day
  const handleDrop = (date: Date, e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && draggingTask) {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, date } : task
      ));
      toast.success(`Task moved to ${format(date, "MMM d, yyyy")}`);
    }
    setDraggingTask(null);
  };
  
  // Custom day renderer to show task indicators and handle drops
  const renderDay = (date: Date, dayProps: React.HTMLAttributes<HTMLDivElement>) => {
    const isSelected = dayProps['aria-selected'];
    const taskCount = tasks.filter(task => 
      task.date.toDateString() === date.toDateString()
    ).length;
    
    return (
      <div 
        className={`relative w-full h-full flex items-center justify-center ${
          isSelected ? "font-bold" : ""
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(date, e)}
      >
        {date.getDate()}
        {taskCount > 0 && (
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {taskCount}
          </span>
        )}
      </div>
    );
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            components={{
              Day: ({ date, ...dayProps }) => renderDay(date, dayProps)
            }}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Tasks for {format(selectedDate, "MMMM d, yyyy")}
          </CardTitle>
          <Button size="sm" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Task
          </Button>
        </CardHeader>
        <CardContent>
          {tasksForSelectedDate.length > 0 ? (
            <div className="space-y-2">
              {tasksForSelectedDate.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-2 border rounded-md bg-card"
                  draggable
                  onDragStart={(e) => handleDragStart(task, e)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      id={`task-${task.id}`}
                    />
                    <div>
                      <Label
                        htmlFor={`task-${task.id}`}
                        className={task.completed ? "line-through text-muted-foreground" : ""}
                      >
                        {task.title}
                      </Label>
                      {task.time && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" /> {task.time}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No tasks for this day. Click "Add Task" to create one.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time (Optional)</Label>
              <Input
                id="time"
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{format(selectedDate, "MMMM d, yyyy")}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
