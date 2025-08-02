"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Calendar, User, Flag, ArrowRight, Edit3, Save, X } from "lucide-react"

interface TaskDetailModalProps {
  task: any
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: any) => void
  onDelete: (taskId: string) => void
  sprints?: any[]
}

export function TaskDetailModal({ task, isOpen, onClose, onUpdate, onDelete, sprints = [] }: TaskDetailModalProps) {
  const [newComment, setNewComment] = useState("")
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editedDescription, setEditedDescription] = useState(task?.description || "")
  const [isSaving, setIsSaving] = useState(false)
  const [comments, setComments] = useState([
    {
      id: "1",
      author: "John Doe",
      content: "This looks good to me. Let's proceed with the implementation.",
      timestamp: "2024-02-01T10:30:00Z",
    },
    {
      id: "2",
      author: "Jane Smith",
      content: "I've updated the wireframes based on the feedback. Please review.",
      timestamp: "2024-02-02T14:20:00Z",
    },
  ])

  // Reset edited description when task changes
  useState(() => {
    setEditedDescription(task?.description || "")
    setIsEditingDescription(false)
  }, [task?.id])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "outline"
      case "in-progress":
        return "default"
      case "done":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do"
      case "in-progress":
        return "In Progress"
      case "done":
        return "Done"
      default:
        return status
    }
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: "Current User",
        content: newComment,
        timestamp: new Date().toISOString(),
      }
      setComments([...comments, comment])
      setNewComment("")
    }
  }

  const handleDelete = () => {
    onDelete(task.id)
    onClose()
  }

  const handleStatusChange = (newStatus: string) => {
    const updatedTask = { ...task, status: newStatus }
    onUpdate(updatedTask)
  }

  const handleStartEditDescription = () => {
    setIsEditingDescription(true)
    setEditedDescription(task.description || "")
  }

  const handleCancelEditDescription = () => {
    setIsEditingDescription(false)
    setEditedDescription(task.description || "")
  }

  const handleSaveDescription = async () => {
    if (editedDescription.trim() === task.description) {
      setIsEditingDescription(false)
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Call the update API with the new description
      const updatedTask = { ...task, description: editedDescription.trim() }
      onUpdate(updatedTask)

      setIsEditingDescription(false)
    } catch (error) {
      console.error("Failed to update description:", error)
      // Handle error - could show a toast notification
    } finally {
      setIsSaving(false)
    }
  }

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancelEditDescription()
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSaveDescription()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl mb-3">{task.title}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {task.assignee}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
                {sprints.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Sprint: {sprints.find((s) => s.id === task.sprintId)?.name || "Backlog"}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Flag className="h-4 w-4" />
                  <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description - Inline Editable */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Description</h3>
                {!isEditingDescription && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStartEditDescription}
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditingDescription ? (
                <div className="space-y-3">
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    onKeyDown={handleDescriptionKeyDown}
                    placeholder="Enter task description..."
                    rows={4}
                    className="resize-none"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSaveDescription} disabled={isSaving}>
                      <Save className="h-3 w-3 mr-1" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancelEditDescription} disabled={isSaving}>
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Press Ctrl+Enter to save, Escape to cancel</p>
                </div>
              ) : (
                <div
                  className="text-muted-foreground leading-relaxed cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                  onClick={handleStartEditDescription}
                >
                  {task.description || (
                    <span className="italic text-muted-foreground/70">Click to add a description...</span>
                  )}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {task.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Comments Section */}
            <div>
              <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>

              {/* Existing Comments */}
              <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleDateString()} at{" "}
                        {new Date(comment.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Add Comment
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div>
              <h3 className="font-semibold mb-3">Status</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Current:</span>
                  <Badge variant={getStatusColor(task.status)}>{getStatusLabel(task.status)}</Badge>
                </div>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Task Details */}
            <div>
              <h3 className="font-semibold mb-3">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assignee:</span>
                  <span>{task.assignee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
                {sprints.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sprint:</span>
                    <span className="text-right">{sprints.find((s) => s.id === task.sprintId)?.name || "Backlog"}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {task.status === "todo" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleStatusChange("in-progress")}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Start Working
                  </Button>
                )}
                {task.status === "in-progress" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleStatusChange("done")}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                )}
                {task.status === "done" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleStatusChange("in-progress")}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Reopen Task
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
