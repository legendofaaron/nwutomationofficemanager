
import { downloadScheduleAsPdf, downloadScheduleAsTxt } from '@/utils/downloadUtils';
import { toast } from 'sonner';
import { Task, ScheduleFilter } from '../ScheduleTypes';

export const useScheduleDownload = (tasks: Task[], currentFilter: ScheduleFilter) => {
  // Handler for downloading schedule as TXT
  const handleDownloadTxt = () => {
    try {
      downloadScheduleAsTxt(tasks, currentFilter);
      toast.success("Schedule downloaded as TXT file");
    } catch (error) {
      console.error("Error downloading TXT:", error);
      toast.error("Failed to download schedule as TXT");
    }
  };

  // Handler for downloading schedule as PDF
  const handleDownloadPdf = () => {
    try {
      downloadScheduleAsPdf(tasks, currentFilter);
      toast.success("Schedule downloaded as PDF file");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download schedule as PDF");
    }
  };

  return {
    handleDownloadTxt,
    handleDownloadPdf
  };
};
