
import * as React from "react"
import * as SonnerToast from "sonner"

import { cn } from "@/lib/utils"

const Toast = SonnerToast.Toaster;

function useToast() {
  return SonnerToast.toast;
}

export { Toast, useToast };
