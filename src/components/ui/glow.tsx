
import { cn } from "@/lib/utils"
import React from "react"

interface GlowProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "bottom" | "top"
}

export function Glow({ className, variant = "bottom", ...props }: GlowProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute select-none",
        {
          "bottom-0 left-0 right-0": variant === "bottom",
          "left-0 right-0 top-0": variant === "top",
        },
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-[200px] w-full",
          {
            "bg-gradient-to-t from-background to-transparent": variant === "bottom",
            "bg-gradient-to-b from-background to-transparent": variant === "top",
          }
        )}
      />
    </div>
  )
}
