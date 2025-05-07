
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Users } from 'lucide-react';
import { Employee } from './types';

interface DownloadCardsSectionProps {
  employees: Employee[];
  onDownloadEmployeeSchedule: () => void;
  onDownloadCrewSchedule: () => void;
}

const DownloadCardsSection: React.FC<DownloadCardsSectionProps> = ({
  employees,
  onDownloadEmployeeSchedule,
  onDownloadCrewSchedule
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Schedule Downloads</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Employee Schedules
            </CardTitle>
            <CardDescription>
              Download schedules for individual employees within specific date ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Select an employee from the list and click the download icon to generate their personalized schedule.
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={onDownloadEmployeeSchedule}>
                Download Employee Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Crew Schedules
            </CardTitle>
            <CardDescription>
              Download schedules for entire crews within specific date ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Select a crew and generate a comprehensive schedule for all members and assignments.
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={onDownloadCrewSchedule}>
                Download Crew Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DownloadCardsSection;
