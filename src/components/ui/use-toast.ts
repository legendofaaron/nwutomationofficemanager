
import { useToast as useToastHook, toast as toastFunction } from "@/hooks/use-toast";

// Re-export the hook and function with enhanced styling
export const useToast = useToastHook;
export const toast = toastFunction;
