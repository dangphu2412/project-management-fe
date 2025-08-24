"use client"

import type React from "react"
import { SidebarTrigger } from "@/shared/design-system/components/ui/sidebar"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/design-system/components/ui/card"
import { Badge } from "@/shared/design-system/components/ui/badge"
import { Button } from "@/shared/design-system/components/ui/button"
import {
  Plus,
  Settings,
  Calendar,
  Target,
  MoreHorizontal,
  Trash2,
  Eye,
  BookOpen,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/design-system/components/ui/dropdown-menu"
import { TaskDetailModal } from "@/features/tasks/task-detail-modal"
import { TaskModal } from "@/features/tasks/task-modal"
import { ToastNotification } from "@/shared/design-system/components/toast-notification"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/design-system/components/ui/collapsible"

// Mock sprint data
const mockSprint = {
  id: "sprint-1",
  name: "Sprint 1 - Authentication & Dashboard",
  startDate: "2024-02-01",
  endDate: "2024-02-14",
  goal: "Implement user authentication and basic dashboard functionality",
  daysRemaining: 8,
}

// Mock user stories in active sprint
const mockUserStories = [
  {
    id: "story-1",
    title: "As a user, I want to log into the system so that I can access my dashboard",
    description: "Users need a secure way to authenticate and access their personalized dashboard",
    priority: "high",
    storyPoints: "5",
    assignee: "John Doe",
    tags: ["authentication", "security"],
    sprintId: "sprint-1",
  },
  {
    id: "story-2",
    title: "As a user, I want to view my task dashboard so that I can track my work",
    description: "Users need a comprehensive view of their assigned tasks and progress",
    priority: "high",
    storyPoints: "3",
    assignee: "Jane Smith",
    tags: ["dashboard", "tasks"],
    sprintId: "sprint-1",
  },
]

// Enhanced mock sprint tasks grouped by user stories
const mockSprintTasks = [
  {
    id: "1",
    title: "Implement JWT authentication",
    description: "Add login and registration functionality with JWT tokens, password hashing, and session management",
    assignee: "John Doe",
    priority: "high",
    status: "todo",
    tags: ["backend", "security", "auth"],
    dueDate: "2024-02-10",
    sprintId: "sprint-1",
    userStoryId: "story-1",
  },
  {
    id: "2",
    title: "Create login form UI",
    description: "Design and implement the login form interface with validation",
    assignee: "Jane Smith",
    priority: "medium",
    status: "in-progress",
    tags: ["frontend", "ui", "forms"],
    dueDate: "2024-02-08",
    sprintId: "sprint-1",
    userStoryId: "story-1",
  },
  {
    id: "3",
    title: "Set up password reset flow",
    description: "Implement forgot password functionality with email verification",
    assignee: "Mike Johnson",
    priority: "medium",
    status: "done",
    tags: ["backend", "email", "security"],
    dueDate: "2024-02-05",
    sprintId: "sprint-1",
    userStoryId: "story-1",
  },
  {
    id: "4",
    title: "Design dashboard wireframes",
    description: "Create comprehensive wireframes for the main dashboard interface",
    assignee: "Jane Smith",
    priority: "high",
    status: "todo",
    tags: ["design", "ui", "wireframes"],
    dueDate: "2024-02-12",
    sprintId: "sprint-1",
    userStoryId: "story-2",
  },
  {
    id: "5",
    title: "Implement task filtering",
    description: "Add filtering functionality for tasks by status, priority, and assignee",
    assignee: "John Doe",
    priority: "medium",
    status: "in-progress",
    tags: ["frontend", "filtering", "ui"],
    dueDate: "2024-02-13",
    sprintId: "sprint-1",
    userStoryId: "story-2",
  },
]

// Mock sprints data for the task modal
const mockSprints = [
  {
    id: "sprint-1",
    name: "Sprint 1 - Authentication & Dashboard",
    status: "active",
    startDate: "2024-02-01",
    endDate: "2024-02-14",
    goal: "Implement user authentication and basic dashboard functionality",
  },
  {
    id: "sprint-2",
    name: "Sprint 2 - User Management",
    status: "planning",
    startDate: "2024-02-15",
    endDate: "2024-02-28",
    goal: "Build comprehensive user management features",
  },
]

export function ActiveSprintView() {
  const [userStories] = useState(mockUserStories)
  const [tasks, setTasks] = useState(mockSprintTasks)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [expandedStories, setExpandedStories] = useState<string[]>(mockUserStories.map((s) => s.id))
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([])

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-primary-100 text-primary-800 border-primary-200"
      case "low":
        return "bg-slate-100 text-slate-600 border-slate-200"
      default:
        return "bg-slate-100 text-slate-600 border-slate-200"
    }
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  const getTasksByStoryAndStatus = (storyId: string, status: string) => {
    return tasks.filter((task) => task.userStoryId === storyId && task.status === status)
  }

  const getTasksByStory = (storyId: string) => {
    return tasks.filter((task) => task.userStoryId === storyId)
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("text/plain")
    const task = tasks.find((t) => t.id === taskId)

    if (task && task.status !== newStatus) {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

      // Show success feedback
      const statusLabels = {
        todo: "To Do",
        "in-progress": "In Progress",
        done: "Done",
      }
      addToast(`Task "${task.title}" moved to ${statusLabels[newStatus as keyof typeof statusLabels]}`, "success")
    }
  }

  const handleCreateTask = (taskData: any) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      status: "todo", // New tasks start in To Do
      sprintId: mockSprint.id, // Assign to current sprint
    }
    setTasks([...tasks, newTask])
    addToast(`Task "${newTask.title}" created successfully`, "success")
  }

  const handleUpdateTask = (taskData: any) => {
    setTasks(tasks.map((task) => (task.id === taskData.id ? { ...task, ...taskData } : task)))
    addToast(`Task "${taskData.title}" updated successfully`, "success")
  }

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    setTasks(tasks.filter((task) => task.id !== taskId))
    if (task) {
      addToast(`Task "${task.title}" deleted successfully`, "success")
    }
  }

  const handleViewTask = (task: any) => {
    setSelectedTask(task)
  }

  const toggleStoryExpansion = (storyId: string) => {
    setExpandedStories((prev) => (prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]))
  }

  const columns = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in-progress", title: "In Progress", status: "in-progress" },
    { id: "done", title: "Done", status: "done" },
  ]

  const renderUserStoryHeader = (story: any) => {
    const storyTasks = getTasksByStory(story.id)
    const completedTasks = storyTasks.filter((t) => t.status === "done").length
    const progress = storyTasks.length > 0 ? Math.round((completedTasks / storyTasks.length) * 100) : 0

    return (
      <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
        <Collapsible open={expandedStories.includes(story.id)}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => toggleStoryExpansion(story.id)}>
                  {expandedStories.includes(story.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
                <BookOpen className="h-5 w-5 text-primary-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1">{story.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{story.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getPriorityColor(story.priority)}>{story.priority}</Badge>
                {story.storyPoints && (
                  <Badge variant="outline" className="bg-primary-100 text-primary-700">
                    {story.storyPoints} pts
                  </Badge>
                )}
                <div className="text-right">
                  <div className="text-sm font-medium">{progress}% Complete</div>
                  <div className="text-xs text-muted-foreground">
                    {completedTasks}/{storyTasks.length} tasks
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-4 text-sm text-muted-foreground">
              <strong>Acceptance Criteria:</strong> {story.acceptanceCriteria || "Not specified"}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Sprint Header */}
      <div className="p-6 border-b bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Active Sprint</h1>
              <p className="text-muted-foreground">Work in progress zone</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Sprint Settings
            </Button>
            <Button onClick={() => setIsCreateTaskModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Sprint Banner */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{mockSprint.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(mockSprint.startDate).toLocaleDateString()} -{" "}
                    {new Date(mockSprint.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {mockSprint.goal}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{mockSprint.daysRemaining}</div>
                <div className="text-sm text-muted-foreground">days remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Stories and Kanban Board */}
      <div className="flex-1 p-6 space-y-6">
        {userStories.map((story) => (
          <div key={story.id}>
            {renderUserStoryHeader(story)}

            {/* Kanban Board for this story */}
            <div className="grid grid-cols-3 gap-6">
              {columns.map((column) => (
                <div key={column.id} className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{column.title}</h3>
                    <Badge variant="secondary">{getTasksByStoryAndStatus(story.id, column.status).length}</Badge>
                  </div>

                  <div
                    className="flex-1 space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed border-muted-foreground/20"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.status)}
                  >
                    {getTasksByStoryAndStatus(story.id, column.status).map((task) => (
                      <Card
                        key={task.id}
                        className="cursor-move hover:shadow-md transition-shadow group relative"
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm font-semibold leading-tight mb-1 line-clamp-2">
                                {task.title}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewTask(task)
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteTask(task.id)
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {/* Priority and Tags */}
                            <div className="flex items-center gap-1 flex-wrap">
                              <Badge className={getPriorityColor(task.priority)} variant="outline">
                                {task.priority}
                              </Badge>
                              {task.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {task.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{task.tags.length - 2}
                                </Badge>
                              )}
                            </div>

                            {/* Assignee and Due Date */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="truncate">{task.assignee}</span>
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {column.status === "todo" && (
                      <Button
                        variant="ghost"
                        className="w-full border-2 border-dashed"
                        onClick={() => setIsCreateTaskModalOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        sprints={mockSprints}
        userStories={userStories}
      />

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          sprints={mockSprints}
        />
      )}

      <ToastNotification toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}
