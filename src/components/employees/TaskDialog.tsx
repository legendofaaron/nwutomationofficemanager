
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { Employee, Crew, TaskForEmployeeView } from './types';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<TaskForEmployeeView, 'id' | 'completed'>) => void;
  employees: Employee[];
  crews: Crew[];
  selectedDate: Date;
  initialAssignee?: string;
  initialCrew?: string[];
  getCrewMembersCount: (crewId: string) => number;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  employees,
  crews,
  selectedDate,
  initialAssignee,
  initialCrew,
  getCrewMembersCount
}) => {
  const [newTask, setNewTask] = useState<Omit<TaskForEmployeeView, 'id' | 'completed'>>({
    text: '',
    date: selectedDate,
    startTime: '09:00',
    endTime: '10:00',
    location: 'Office',
    assignedTo: initialAssignee || '',
    assignedToAvatars: [],
    crew: initialCrew || []
  });

  const handleCreateTask = () => {
    onCreateTask(newTask);
    // Reset form
    setNewTask({
      text: '',
      date: selectedDate,
      startTime: '09:00',
      endTime: '10:00',
      location: 'Office',
      assignedTo: '',
      assignedToAvatars: [],
      crew: []
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Task</DialogTitle>
          <DialogDescription>
            Create a new task and assign it to employees or crews
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input 
              id="task-title" 
              placeholder="Task title" 
              value={newTask.text}
              onChange={(e) => setNewTask({...newTask, text: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label>Date</Label>
            <div className="border rounded-md p-2 bg-muted/30">
              {format(selectedDate, 'MMMM d, yyyy')}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input 
                id="start-time" 
                type="time" 
                value={newTask.startTime}
                onChange={(e) => setNewTask({...newTask, startTime: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input 
                id="end-time" 
                type="time" 
                value={newTask.endTime}
                onChange={(e) => setNewTask({...newTask, endTime: e.target.value})}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="Location" 
              value={newTask.location}
              onChange={(e) => setNewTask({...newTask, location: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label>Assign To</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <Tabs defaultValue="employee" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="employee">Employee</TabsTrigger>
                    <TabsTrigger value="crew">Crew</TabsTrigger>
                  </TabsList>
                  <TabsContent value="employee" className="p-0 mt-2">
                    <Select 
                      onValueChange={(value) => {
                        const employee = employees.find(e => e.id === value);
                        if (employee) {
                          setNewTask({
                            ...newTask, 
                            assignedTo: employee.name,
                            crew: []
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={newTask.assignedTo || "Select employee"} />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>
                  <TabsContent value="crew" className="p-0 mt-2">
                    <Select 
                      onValueChange={(value) => {
                        const crew = crews.find(c => c.id === value);
                        if (crew) {
                          setNewTask({
                            ...newTask, 
                            assignedTo: `Crew: ${crew.name}`,
                            crew: [crew.id]
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crew" />
                      </SelectTrigger>
                      <SelectContent>
                        {crews.map(crew => (
                          <SelectItem key={crew.id} value={crew.id}>
                            {crew.name} ({getCrewMembersCount(crew.id)} members)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
