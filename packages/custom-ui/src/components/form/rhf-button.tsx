"use client"

import React from "react"
import { useFormContext } from "react-hook-form"
import { CustomButton } from "../custom-button"

// ----------------------------------------------------------------------

type Props = {
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  children?: React.ReactNode
  type?: "button" | "submit" | "reset"
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  onClick?: () => void
  size?: "sm" | "md" | "lg"
}

export function RHFButton({ 
  loading = false,
  loadingText = "Loading...",
  disabled,
  children,
  type = "button",
  className,
  variant = "default",
  size = "md",
  onClick,
  ...other 
}: Props) {
  const { formState: { isSubmitting } } = useFormContext()
  
  const isLoading = loading || isSubmitting

  return (
    <CustomButton
      type={type}
      disabled={disabled}
      loading={isLoading}
      loadingText={loadingText}
      className={className}
      onClick={onClick}
      variant={variant}
      size={size}
      {...other}
    >
      {children}
    </CustomButton>
  )
}
