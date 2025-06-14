
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      // Do not close automatically when interacting outside
      // unless it has a specific ID (todo-calendar-bubble)
      onInteractOutside={(e) => {
        // Get the popover ID
        const id = props.id;
        
        // If this is not the calendar bubble popover, allow original handler
        if (id !== 'todo-calendar-bubble') {
          // Close all other popovers when clicking outside
          document.dispatchEvent(new CustomEvent('closeAllPopovers', { 
            detail: { exceptId: props.id } 
          }));
          
          // Allow original handler to still work for non-calendar popovers
          if (props.onInteractOutside) {
            props.onInteractOutside(e);
          }
        } else {
          // For the calendar bubble, prevent closing on outside clicks
          e.preventDefault();
        }
      }}
      onDragOver={(e) => {
        // Allow dropzones to work
        e.stopPropagation();
        if (props.onDragOver) {
          props.onDragOver(e);
        }
      }}
      onDrop={(e) => {
        // Handle drops inside popovers
        e.stopPropagation();
        if (props.onDrop) {
          props.onDrop(e);
        }
      }}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
