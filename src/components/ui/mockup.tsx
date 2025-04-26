
import { cn } from "@/lib/utils"
import React from "react"

interface MockupFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "medium" | "large"
}

export function MockupFrame({
  children,
  className,
  size = "medium",
  ...props
}: MockupFrameProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-background p-4 shadow-xl",
        {
          "mx-4 sm:mx-8 md:mx-12": size === "small",
          "mx-8 sm:mx-16 md:mx-24": size === "medium",
          "mx-12 sm:mx-24 md:mx-36": size === "large",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface MockupProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "responsive" | "window"
}

export function Mockup({ children, className, type = "window", ...props }: MockupProps) {
  if (type === "responsive") {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-lg border bg-background shadow-2xl",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-background shadow-2xl",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5 border-b px-3 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400/50" />
      </div>
      {children}
    </div>
  )
}
