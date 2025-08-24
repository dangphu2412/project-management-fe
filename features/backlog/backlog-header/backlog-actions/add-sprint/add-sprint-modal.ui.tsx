"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/design-system/components/ui/dialog"
import { Button } from "@/shared/design-system/components/ui/button"
import { Input } from "@/shared/design-system/components/ui/input"
import { Textarea } from "@/shared/design-system/components/ui/textarea"
import { Label } from "@/shared/design-system/components/ui/label"

interface SprintModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (sprint: any) => void
  sprint?: any
}

export function AddSprintModal({ isOpen, onClose, onSubmit, sprint }: SprintModalProps) {
  const [formData, setFormData] = useState({
    name: sprint?.name || "",
    goal: sprint?.goal || "",
    startDate: sprint?.startDate || "",
    endDate: sprint?.endDate || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
    if (!sprint) {
      setFormData({
        name: "",
        goal: "",
        startDate: "",
        endDate: "",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{sprint ? "Edit Sprint" : "Create New Sprint"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Sprint Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter sprint name..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Sprint Goal</Label>
            <Textarea
              id="goal"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              placeholder="What do you want to achieve in this sprint?"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{sprint ? "Update Sprint" : "Create Sprint"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
