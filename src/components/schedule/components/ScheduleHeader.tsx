
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, User, Users, MapPin } from 'lucide-react';

interface ScheduleHeaderProps {
  onDownloadPdf: () => void;
  onDownloadTxt: () => void;
  onAddIndividualTask: () => void;
  onAddCrewTask: () => void;
  onAddClientVisit: () => void;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  onDownloadPdf,
  onDownloadTxt,
  onAddIndividualTask,
  onAddCrewTask,
  onAddClientVisit
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Schedule Management</h1>
      
      <div className="flex space-x-2">
        {/* Download buttons */}
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-2 h-9 font-medium"
          onClick={onDownloadPdf}
        >
          <FileDown className="h-4 w-4" />
          PDF
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-2 h-9 font-medium"
          onClick={onDownloadTxt}
        >
          <FileText className="h-4 w-4" />
          TXT
        </Button>
        
        <Button 
          size="sm" 
          className="gap-2 h-9 font-medium"
          onClick={onAddIndividualTask}
        >
          <User className="h-4 w-4" />
          Employee Task
        </Button>
        
        <Button 
          size="sm" 
          className="gap-2 h-9 font-medium"
          onClick={onAddCrewTask}
        >
          <Users className="h-4 w-4" />
          Crew Task
        </Button>
        
        <Button 
          size="sm" 
          variant="secondary" 
          className="gap-2 h-9 font-medium"
          onClick={onAddClientVisit}
        >
          <MapPin className="h-4 w-4" />
          Client Visit
        </Button>
      </div>
    </div>
  );
};

export default ScheduleHeader;
