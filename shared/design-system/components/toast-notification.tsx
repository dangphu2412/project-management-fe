"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/shared/design-system/components/ui/button"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastNotificationProps {
  toasts: Toast[]
  onRemoveToast: (id: string) => void
}

export function ToastNotification({ toasts, onRemoveToast }: ToastNotificationProps) {
  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        onRemoveToast(toast.id)
      }, 4000) // Auto-remove after 4 seconds

      return () => clearTimeout(timer)
    })
  }, [toasts, onRemoveToast])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 p-4 rounded-lg shadow-lg border max-w-sm
            ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : ""}
            ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" : ""}
            ${toast.type === "info" ? "bg-blue-50 border-blue-200 text-blue-800" : ""}
            animate-in slide-in-from-right duration-300
          `}
        >
          {toast.type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveToast(toast.id)}
            className="h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
