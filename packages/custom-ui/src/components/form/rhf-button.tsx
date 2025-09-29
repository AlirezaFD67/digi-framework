"use client"

import React from "react"
import { useFormContext } from "react-hook-form"
import { Button, buttonVariants, VariantProps } from "@workspace/ui/components/button"

// ----------------------------------------------------------------------

type Props = {
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  children?: React.ReactNode
  type?: "button" | "submit" | "reset"
  className?: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  onClick?: () => void
  size?: VariantProps<typeof buttonVariants>['size']
}

export function RHFButton({ 
  loading = false,
  loadingText = "Loading...",
  disabled,
  children,
  type = "button",
  className,
  variant,
  size,
  onClick,
  ...other 
}: Props) {
  const { formState: { isSubmitting } } = useFormContext()
  
  const isLoading = loading || isSubmitting

  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      className={className}
      onClick={onClick}
      variant={variant}
      size={size}
      {...other}
    >
      {isLoading ? loadingText : children}
    </Button>
  )
}
