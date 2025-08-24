"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/design-system/components/ui/dialog"
import { Button } from "@/shared/design-system/components/ui/button"
import { Input } from "@/shared/design-system/components/ui/input"
import { Textarea } from "@/shared/design-system/components/ui/textarea"
import { Label } from "@/shared/design-system/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/design-system/components/ui/select"
import { Badge } from "@/shared/design-system/components/ui/badge"
import { X } from "lucide-react"

interface UserStoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userStory: any) => void
  userStory?: any
  sprints?: any[]
}

export function AddUserStoryModal({ isOpen, onClose, onSubmit, userStory, sprints = [] }: UserStoryModalProps) {
  const [formData, setFormData] = useState({
    title: userStory?.title || "",
    description: userStory?.description || "",
    acceptanceCriteria: userStory?.acceptanceCriteria || "",
    priority: userStory?.priority || "medium",
    storyPoints: userStory?.storyPoints || "",
    assignee: userStory?.assignee || "",
    tags: userStory?.tags || [],
    sprintId: userStory?.sprintId || null,
  })
  const [newTag, setNewTag] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, id: userStory?.id })
    onClose()
    if (!userStory) {
      setFormData({
        title: "",
        description: "",
        acceptanceCriteria: "",
        priority: "medium",
        storyPoints: "",
        assignee: "",
        tags: [],
        sprintId: null,
      })
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag: any) => tag !== tagToRemove),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{userStory ? "Edit User Story" : "Create New User Story"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">User Story Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="As a [user], I want [goal] so that [benefit]..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the user story..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acceptanceCriteria">Acceptance Criteria</Label>
            <Textarea
              id="acceptanceCriteria"
              value={formData.acceptanceCriteria}
              onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
              placeholder="Given [context], when [action], then [outcome]..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storyPoints">Story Points</Label>
              <Select
                value={formData.storyPoints}
                onValueChange={(value) => setFormData({ ...formData, storyPoints: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select points" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="13">13</SelectItem>
                  <SelectItem value="21">21</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Product Owner</Label>
              <Select
                value={formData.assignee}
                onValueChange={(value) => setFormData({ ...formData, assignee: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sprint">Sprint</Label>
              <Select
                value={formData.sprintId || "none"}
                onValueChange={(value) => setFormData({ ...formData, sprintId: value === "none" ? null : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sprint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Backlog (No Sprint)</SelectItem>
                  {sprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{userStory ? "Update User Story" : "Create User Story"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
