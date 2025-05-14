
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { CustomCaptionProps } from "./types";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

// Custom caption component to show month and year with better styling
export const CustomCaption = ({ 
  displayMonth, 
  onPreviousClick, 
  onNextClick,
  monthFormat = 'MMMM yyyy'
}: CustomCaptionProps) => {
  const { resolvedTheme } = useTheme();
  const isSuperDarkMode = resolvedTheme === 'superdark';
  
  return (
    <div className="flex items-center justify-between px-2 py-1">
      <button
        onClick={onPreviousClick}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-background hover:bg-muted p-0 opacity-90 hover:opacity-100",
          isSuperDarkMode && "bg-[#0A0A0A] border-[#181818] text-gray-300 hover:bg-[#111111]"
        )}
        aria-label="Previous month"
      >
        <ChevronLeft className={cn("h-4 w-4 text-primary", isSuperDarkMode && "text-gray-300")} />
      </button>
      
      <div className={cn("text-sm font-medium text-center", isSuperDarkMode && "text-gray-200")}>
        {format(displayMonth, monthFormat || 'MMMM yyyy')}
      </div>
      
      <button
        onClick={onNextClick}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-7 w-7 bg-background hover:bg-muted p-0 opacity-90 hover:opacity-100",
          isSuperDarkMode && "bg-[#0A0A0A] border-[#181818] text-gray-300 hover:bg-[#111111]"
        )}
        aria-label="Next month"
      >
        <ChevronRight className={cn("h-4 w-4 text-primary", isSuperDarkMode && "text-gray-300")} />
      </button>
    </div>
  );
};
