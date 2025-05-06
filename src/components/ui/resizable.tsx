
import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
);

const ResizablePanel = ResizablePrimitive.Panel;

interface ResizableHandleProps extends React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> {
  withHandle?: boolean;
  className?: string;
}

const ResizableHandle = ({
  withHandle = false,
  className,
  ...props
}: ResizableHandleProps) => {
  const [isResizing, setIsResizing] = useState(false);

  // Handle mouse events to track resizing state
  const handleMouseDown = () => {
    setIsResizing(true);
    // Add a class to the body to indicate resizing is happening
    document.body.classList.add('resizing');
  };

  // Global event listeners for mouseup
  useEffect(() => {
    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        document.body.classList.remove('resizing');
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('resizing');
    };
  }, [isResizing]);

  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        isResizing && "after:bg-primary/50",
        className
      )}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {withHandle && (
        <div className={cn(
          "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border transition-colors",
          isResizing && "bg-primary border-primary"
        )}>
          <GripVertical className={cn("h-2.5 w-2.5", isResizing && "text-primary-foreground")} />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
};

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
