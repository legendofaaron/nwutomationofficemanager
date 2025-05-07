
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
  onSave: (taskText: string) => void;
  taskAssignee?: string | null;
  employees?: Employee[];
  crews?: Crew[];
  selectedDate?: Date;
  getCrewMembersCount?: (crewId: string) => number;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  taskAssignee = null,
  employees = [],
  crews = [],
  selectedDate = new Date(),
  getCrewMembersCount = () => 0
}) => {
  const [taskText, setTaskText] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('Office');
  const [assignee, setAssignee] = useState(taskAssignee || '');

  const handleSave = () => {
    onSave(taskText);
    // Reset form
    setTaskText('');
    setStartTime('09:00');
    setEndTime('10:00');
    setLocation('Office');
    setAssignee('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Task</DialogTitle>
          <DialogDescription>
            {taskAssignee ? `Create a new task for ${taskAssignee}` : 'Create a new task and assign it'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input 
              id="task-title" 
              placeholder="Task title" 
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
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
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input 
                id="end-time" 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="Location" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          {!taskAssignee && employees.length > 0 && crews.length > 0 && (
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
                            setAssignee(employee.name);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
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
                            setAssignee(`Crew: ${crew.name}`);
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
          )}
          {taskAssignee && (
            <div className="grid gap-2">
              <Label>Assigned To</Label>
              <div className="border rounded-md p-2 bg-muted/30">
                {taskAssignee}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
