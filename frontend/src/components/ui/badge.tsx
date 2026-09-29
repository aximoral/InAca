import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-xl px-3 py-1 text-xs font-bold transition-colors focus-ring",
  {
    variants: {
      variant: {
        default:
          "shadow-neu-extruded-small bg-neu-bg text-neu-fg",
        secondary:
          "shadow-neu-inset-small bg-neu-bg text-neu-muted",
        destructive:
          "shadow-neu-inset-small bg-red-100 text-red-700",
        outline:
          "text-neu-fg shadow-neu-extruded-small",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
