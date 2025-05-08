
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DownloadCloud, Users } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Employee Schedules</h3>
              <p className="text-sm text-muted-foreground">
                {employees.length} employees total
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onDownloadEmployeeSchedule} className="gap-1">
            <DownloadCloud className="h-4 w-4" />
            Download
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Crew Schedules</h3>
              <p className="text-sm text-muted-foreground">
                Task assignments for crews
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onDownloadCrewSchedule} className="gap-1">
            <DownloadCloud className="h-4 w-4" />
            Download
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadCardsSection;
