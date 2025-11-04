import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { Loader2 } from "lucide-react"

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  loading?: boolean
  loadingText?: string
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, size = "md", variant = "default", loading = false, loadingText, children, disabled, ...props }, ref) => {
    return (
      <Button
        className={cn(
          // Custom styles based on size
          size === "sm" && "h-8 px-3 text-xs",
          size === "md" && "h-10 px-4 py-2",
          size === "lg" && "h-12 px-6 text-lg",
          // Custom styling
          "font-medium transition-all duration-200 hover:scale-105",
          loading && "opacity-70 cursor-not-allowed",
          className
        )}
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
        variant={variant}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {loading && loadingText ? loadingText : children}
      </Button>
    )
  }
)
CustomButton.displayName = "CustomButton"

export { CustomButton }
