"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"

interface AlertModalProps {
  show: boolean
  type: "success" | "error" | "warning" | "info" | string
  title: string
  message: string
  onClose: () => void
}

export default function AlertModal({ show, type, title, message, onClose }: AlertModalProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-600" />
      case "error":
        return <XCircle className="w-12 h-12 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-yellow-600" />
      default:
        return <Info className="w-12 h-12 text-blue-600" />
    }
  }

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 hover:bg-green-700"
      case "error":
        return "bg-red-600 hover:bg-red-700"
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700"
      default:
        return "bg-blue-600 hover:bg-blue-700"
    }
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center py-6">
          <div className="mx-auto mb-4">{getIcon()}</div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <Button onClick={onClose} className={`w-full ${getButtonColor()}`}>
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
