
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
}

const ScheduleView = ({ content }: { content?: string }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [tasks] = React.useState<Task[]>([
    {
      id: '1',
      title: 'Team Meeting',
      date: new Date(),
      completed: false,
    },
    {
      id: '2',
      title: 'Project Review',
      date: new Date(),
      completed: true,
    },
  ]);

  return (
    <div className="p-4">
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className={cn("rounded-md border", "pointer-events-auto")}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tasks for {selectedDate.toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg",
                        task.completed ? "bg-muted/50" : "bg-card"
                      )}
                    >
                      <span className={cn(task.completed && "line-through text-muted-foreground")}>
                        {task.title}
                      </span>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="h-4 w-4"
                        readOnly
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg",
                      task.completed ? "bg-muted/50" : "bg-card"
                    )}
                  >
                    <div>
                      <span className={cn("block", task.completed && "line-through text-muted-foreground")}>
                        {task.title}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {task.date.toLocaleDateString()}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      className="h-4 w-4"
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleView;
