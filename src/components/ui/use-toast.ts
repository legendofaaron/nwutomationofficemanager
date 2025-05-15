
// Re-export the toast hooks from the main implementation
import { useToast, toast } from "@/hooks/use-toast";
import type { ToasterToast } from "@/hooks/use-toast";

export { useToast, toast, type ToasterToast };
