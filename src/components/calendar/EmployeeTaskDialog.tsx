
import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DroppedItem } from './CalendarTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TaskFormValues } from './CalendarTypes';

interface EmployeeTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  droppedItem: DroppedItem | null;
  form: UseFormReturn<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void;
}

const EmployeeTaskDialog: React.FC<EmployeeTaskDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  droppedItem, 
  form, 
  onSubmit 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {droppedItem && droppedItem.type === 'employee' ? (
              <div className="flex items-center gap-2">
                <span>Assign Task to {droppedItem.originalData?.name || droppedItem.text.split(' - ')[1]}</span>
                {droppedItem.originalData?.avatarUrl && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={droppedItem.originalData.avatarUrl} />
                    <AvatarFallback>
                      {(droppedItem.originalData?.name || droppedItem.text.split(' - ')[1]).substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ) : (
              "Assign New Task"
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Description</FormLabel>
                <FormControl>
                  <Input placeholder="What needs to be done?" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Where will this take place?" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date: {format(field.value, 'MMMM d, yyyy')}</FormLabel>
                <FormControl>
                  <div className="hidden">
                    <Input {...field} type="hidden" value={field.value.toISOString()} />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeTaskDialog;
