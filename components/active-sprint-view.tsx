"use client"

import type React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Settings, Calendar, Target, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskDetailModal } from "@/components/task-detail-modal"
import { TaskModal } from "@/components/task-modal"
import { ToastNotification } from "@/components/toast-notification"

// Mock sprint data
const mockSprint = {
  id: "sprint-1",
  name: "Sprint 1 - Authentication & Dashboard",
  startDate: "2024-02-01",
  endDate: "2024-02-14",
  goal: "Implement user authentication and basic dashboard functionality",
  daysRemaining: 8,
}

// Enhanced mock sprint tasks with more details
const mockSprintTasks = [
  {
    id: "1",
    title: "Implement user authentication",
    description: "Add login and registration functionality with JWT tokens, password hashing, and session management",
    assignee: "John Doe",
    priority: "high",
    status: "todo",
    tags: ["backend", "security", "auth"],
    dueDate: "2024-02-10",
    sprintId: "sprint-1",
  },
  {
    id: "2",
    title: "Design dashboard wireframes",
    description:
      "Create comprehensive wireframes for the main dashboard interface including navigation and key metrics",
    assignee: "Jane Smith",
    priority: "medium",
    status: "in-progress",
    tags: ["design", "ui", "wireframes"],
    dueDate: "2024-02-08",
    sprintId: "sprint-1",
  },
  {
    id: "3",
    title: "Set up database schema",
    description: "Design and implement the initial database schema for users, tasks, and projects",
    assignee: "Mike Johnson",
    priority: "high",
    status: "done",
    tags: ["backend", "database", "schema"],
    dueDate: "2024-02-05",
    sprintId: "sprint-1",
  },
  {
    id: "4",
    title: "Create API endpoints",
    description: "Develop RESTful API endpoints for user management and task operations",
    assignee: "John Doe",
    priority: "medium",
    status: "todo",
    tags: ["backend", "api", "rest"],
    dueDate: "2024-02-12",
    sprintId: "sprint-1",
  },
  {
    id: "5",
    title: "Implement task filtering",
    description: "Add filtering functionality for tasks by status, priority, and assignee",
    assignee: "Jane Smith",
    priority: "low",
    status: "in-progress",
    tags: ["frontend", "filtering", "ui"],
    dueDate: "2024-02-13",
    sprintId: "sprint-1",
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
  const [tasks, setTasks] = useState(mockSprintTasks)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
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

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
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

  const columns = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in-progress", title: "In Progress", status: "in-progress" },
    { id: "done", title: "Done", status: "done" },
  ]

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

      {/* Kanban Board */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-3 gap-6 h-full">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary">{getTasksByStatus(column.status).length}</Badge>
              </div>

              <div
                className="flex-1 space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed border-muted-foreground/20"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {getTasksByStatus(column.status).map((task) => (
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
                          <Badge variant={getPriorityColor(task.priority)} className="text-xs">
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

      {/* Modals */}
      <TaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        sprints={mockSprints}
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
