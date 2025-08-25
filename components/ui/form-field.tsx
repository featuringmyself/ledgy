"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "number" | "password" | "textarea"
  placeholder?: string
  required?: boolean
  value?: string
  onChange?: (value: string) => void
  error?: string
  success?: boolean
  disabled?: boolean
  className?: string
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  value = "",
  onChange,
  error,
  success = false,
  disabled = false,
  className
}: FormFieldProps) {
  const [focused, setFocused] = useState(false)
  const [touched, setTouched] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
    if (!touched) setTouched(true)
  }

  const showError = error && touched
  const showSuccess = success && touched && !error

  return (
    <div className={cn("space-y-2", className)}>
      <Label 
        htmlFor={name}
        className={cn(
          "text-sm font-medium transition-colors",
          showError && "text-destructive",
          showSuccess && "text-green-600 dark:text-green-400"
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="relative">
        {type === "textarea" ? (
          <Textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false)
              setTouched(true)
            }}
            disabled={disabled}
            className={cn(
              "transition-all duration-200",
              showError && "border-destructive focus-visible:border-destructive",
              showSuccess && "border-green-500 focus-visible:border-green-500",
              focused && "ring-2 ring-ring/20"
            )}
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={showError ? `${name}-error` : undefined}
          />
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false)
              setTouched(true)
            }}
            disabled={disabled}
            className={cn(
              "transition-all duration-200",
              showError && "border-destructive focus-visible:border-destructive",
              showSuccess && "border-green-500 focus-visible:border-green-500",
              focused && "ring-2 ring-ring/20"
            )}
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={showError ? `${name}-error` : undefined}
          />
        )}
        
        {(showError || showSuccess) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {showError ? (
              <AlertCircle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
          </div>
        )}
      </div>
      
      {showError && (
        <p id={`${name}-error`} className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}