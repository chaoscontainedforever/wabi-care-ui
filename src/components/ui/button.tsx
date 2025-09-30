import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow hover:shadow-lg hover:scale-105 transform",
        destructive:
          "bg-gradient-to-r from-red-400 to-red-600 text-white shadow hover:shadow-lg hover:scale-105 transform",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow hover:shadow-lg hover:scale-105 transform",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        info:
          "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow hover:shadow-lg hover:scale-105 transform",
        success:
          "bg-gradient-to-r from-green-400 to-green-600 text-white shadow hover:shadow-lg hover:scale-105 transform",
        warning:
          "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow hover:shadow-lg hover:scale-105 transform",
        light:
          "bg-gradient-to-r from-white to-gray-100 text-black shadow hover:shadow-lg hover:scale-105 transform",
        dark:
          "bg-gradient-to-r from-indigo-800 to-black text-white shadow hover:shadow-lg hover:scale-105 transform",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
