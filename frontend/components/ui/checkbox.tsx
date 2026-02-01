"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-[18px] shrink-0 rounded-[5px] border-2 border-muted-foreground/50 bg-secondary/50 transition-all duration-150 outline-none",
        "hover:border-primary/70 hover:bg-secondary",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:shadow-[0_0_8px_rgba(232,115,74,0.4)]",
        "data-[state=checked]:text-primary-foreground",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",
        "aria-invalid:ring-destructive/30 aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current animate-in zoom-in-75 duration-150"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
