import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold transition-all duration-300 ease-out focus-ring disabled:pointer-events-none disabled:opacity-50 min-w-[48px] min-h-[48px]",
  {
    variants: {
      variant: {
        default:
          "bg-neu-accent text-white shadow-neu-extruded hover:-translate-y-1 hover:shadow-neu-hover active:translate-y-0.5 active:shadow-neu-inset-deep",
        destructive:
          "bg-red-500 text-white shadow-neu-extruded hover:-translate-y-1 hover:shadow-neu-hover active:translate-y-0.5 active:shadow-neu-inset",
        outline:
          "bg-neu-bg text-neu-fg shadow-neu-extruded hover:-translate-y-1 hover:shadow-neu-hover active:translate-y-0.5 active:shadow-neu-inset",
        secondary:
          "bg-neu-bg text-neu-fg shadow-neu-extruded hover:-translate-y-1 hover:shadow-neu-hover active:translate-y-0.5 active:shadow-neu-inset",
        ghost: "hover:bg-neu-bg hover:shadow-neu-inset hover:text-neu-fg",
        link: "text-neu-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 rounded-xl px-4 text-xs",
        lg: "h-14 rounded-2xl px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
