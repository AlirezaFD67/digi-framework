"use client"

import React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@workspace/ui/components/input-otp"
import { Label } from "@workspace/ui/components/label"
import { cn } from "@workspace/ui/lib/utils"
import { useFieldError } from "../../contexts/error-context"
import { FieldErrorDisplay } from "../error/field-error-display"

// ----------------------------------------------------------------------

type Props = {
  name: string
  label?: string
  helperText?: string
  required?: boolean
  className?: string
  containerClassName?: string
  length: number
  // Validation rules
  pattern?: {
    value: RegExp
    message: string
  }
  validate?: (value: any) => boolean | string
}

export function RHFOTP({ 
  name, 
  label,
  helperText,
  required,
  className,
  containerClassName,
  ...other 
}: Props) {
  const { control, setValue } = useFormContext()
  
  // Safely use field error hook - it will work if ErrorProvider is available
  let globalErrors: any[] = []
  let removeError = (errorId: string) => {}
  
  try {
    const fieldErrorHook = useFieldError(name)
    globalErrors = fieldErrorHook.errors
    removeError = fieldErrorHook.removeError
  } catch (error) {
    // ErrorProvider not available, continue without global errors
    console.warn('ErrorProvider not found, global field errors will not be displayed')
  }

  // Extract validation rules from other props
  const {
    pattern,
    length,
    validate,
    ...inputProps
  } = other

  // Combine validation rules
  const validationRules = {
    ...(required && { required: "This field is required" }),
    ...(pattern && { pattern }),
    ...(length && { maxLength: length }),
    ...(validate && { validate })
  }

  return (
    // @ts-ignore
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({ field, fieldState: { error } }) => {
        return (
          <div className="w-full space-y-2">
            {label && (
              <Label htmlFor={name} className="text-sm font-medium">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            )}
            
            <InputOTP
              maxLength={length}
              value={field.value || ""}
              onChange={(value) => setValue(name, value)}
              onBlur={field.onBlur}
              containerClassName={cn(
                "justify-center",
                containerClassName
              )}
              className={cn(
                "disabled:cursor-not-allowed",
                className
              )}
              {...inputProps}
            >
              <InputOTPGroup>
                {Array.from({ length }).map((_, index) => (
                  <React.Fragment key={index}>
                    <InputOTPSlot className="text-center w-12 h-12" index={index} />
                    {/* {index < length - 1 && (
                      <InputOTPSeparator />
                    )} */}
                  </React.Fragment>
                ))}
              </InputOTPGroup>
            </InputOTP>
            
            {/* Show React Hook Form validation errors */}
            {error && (
              <p className="text-sm text-red-500">{error.message}</p>
            )}
            
            {/* Show global field errors */}
            {!error && globalErrors.map((globalError) => (
              <FieldErrorDisplay
                key={globalError.id}
                error={globalError}
                onDismiss={removeError}
                dismissible={globalError.dismissible}
                className="mt-1"
              />
            ))}
            
            {/* Show helper text when no errors */}
            {helperText && !error && globalErrors.length === 0 && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
        )
      }}
    />
  )
}
