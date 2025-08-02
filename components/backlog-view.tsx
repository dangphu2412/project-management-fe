"use client"

import type React from "react"

import { useState } from "react"
import {
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  CheckCircle,
  Calendar,
  Users,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskModal } from "@/components/task-modal"
import { TaskDetailModal } from "@/components/task-detail-modal"
import { SprintModal } from "@/components/sprint-modal"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { ToastNotification } from "@/components/toast-notification"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock data with sprint assignments
const mockSprints = [
  {
    id: "sprint-1",
    name: "Sprint 1 - Authentication & Dashboard",
    status: "planning", // planning, active, completed
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

const mockTasks = [
  {
    id: "1",
    title: "Implement user authentication",
    description: "Add login and registration functionality with JWT tokens",
    priority: "high",
    assignee: "John Doe",
    tags: ["backend", "security"],
    dueDate: "2024-02-15",
    status: "backlog",
    sprintId: "sprint-1",
  },
  {
    id: "2",
    title: "Design dashboard wireframes",
    description: "Create wireframes for the main dashboard interface",
    priority: "medium",
    assignee: "Jane Smith",
    tags: ["design", "ui"],
    dueDate: "2024-02-10",
    status: "backlog",
    sprintId: "sprint-1",
  },
  {
    id: "3",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment",
    priority: "low",
    assignee: "Mike Johnson",
    tags: ["devops", "automation"],
    dueDate: "2024-02-20",
    status: "backlog",
    sprintId: null, // Unassigned to sprint (in backlog)
  },
  {
    id: "4",
    title: "User profile management",
    description: "Allow users to update their profile information",
    priority: "medium",
    assignee: "Jane Smith",
    tags: ["frontend", "user"],
    dueDate: "2024-02-25",
    status: "backlog",
    sprintId: "sprint-2",
  },
]

export function BacklogView() {
  const [tasks, setTasks] = useState(mockTasks)
  const [sprints, setSprints] = useState(mockSprints)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [expandedSprints, setExpandedSprints] = useState<string[]>(["backlog", ...mockSprints.map((s) => s.id)])

  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null)

  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([])

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.setData("text/plain", taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverTarget(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDragEnter = (e: React.DragEvent, targetSprintId: string | null) => {
    e.preventDefault()
    setDragOverTarget(targetSprintId || "backlog")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over target if we're leaving the drop zone entirely
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverTarget(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetSprintId: string | null) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("text/plain")

    if (taskId && taskId !== draggedTask) return

    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Don't move if dropping on the same sprint
    if (task.sprintId === targetSprintId) {
      setDraggedTask(null)
      setDragOverTarget(null)
      return
    }

    // Update task's sprint assignment
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, sprintId: targetSprintId } : t)))

    setDraggedTask(null)
    setDragOverTarget(null)

    // Show success feedback
    const targetName = targetSprintId ? sprints.find((s) => s.id === targetSprintId)?.name : "Backlog"

    addToast(`Task "${task.title}" moved to ${targetName}`, "success")
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

  const getSprintStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "planning":
        return "outline"
      default:
        return "outline"
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter

    return matchesSearch && matchesPriority && matchesAssignee
  })

  const getTasksBySprint = (sprintId: string | null) => {
    return filteredTasks.filter((task) => task.sprintId === sprintId)
  }

  const handleCreateTask = (taskData: any) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      status: "backlog",
    }
    setTasks([...tasks, newTask])
  }

  const handleCreateSprint = (sprintData: any) => {
    const newSprint = {
      id: `sprint-${Date.now()}`,
      ...sprintData,
      status: "planning",
    }
    setSprints([...sprints, newSprint])
    setExpandedSprints([...expandedSprints, newSprint.id])
  }

  const handleUpdateTask = (taskData: any) => {
    setTasks(tasks.map((task) => (task.id === taskData.id ? { ...task, ...taskData } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleSprintAction = (sprintId: string, action: string) => {
    setSprints(
      sprints.map((sprint) => {
        if (sprint.id === sprintId) {
          if (action === "start" && sprint.status === "planning") {
            return { ...sprint, status: "active" }
          } else if (action === "complete" && sprint.status === "active") {
            return { ...sprint, status: "completed" }
          }
        }
        return sprint
      }),
    )
  }

  const toggleSprintExpansion = (sprintId: string) => {
    setExpandedSprints((prev) => (prev.includes(sprintId) ? prev.filter((id) => id !== sprintId) : [...prev, sprintId]))
  }

  const renderSprintHeader = (sprint: any) => (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-3">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => toggleSprintExpansion(sprint.id)}>
            {expandedSprints.includes(sprint.id) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{sprint.name}</h3>
            <Badge variant={getSprintStatusColor(sprint.status)}>{sprint.status}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {getTasksBySprint(sprint.id).length} tasks
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {sprint.status === "planning" && (
          <Button size="sm" onClick={() => handleSprintAction(sprint.id, "start")} className="gap-1">
            <Play className="h-3 w-3" />
            Start Sprint
          </Button>
        )}
        {sprint.status === "active" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSprintAction(sprint.id, "complete")}
            className="gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Complete Sprint
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Sprint
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Sprint
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  const renderBacklogHeader = () => (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-3">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" onClick={() => toggleSprintExpansion("backlog")}>
            {expandedSprints.includes("backlog") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Backlog</h3>
            <Badge variant="outline">Unassigned</Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Users className="h-3 w-3" />
            {getTasksBySprint(null).length} tasks
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Backlog</h1>
              <p className="text-muted-foreground">Manage sprints and unassigned tasks</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCreateSprintModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Sprint
            </Button>
            <Button onClick={() => setIsCreateTaskModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sprint Groups */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Active and Planning Sprints */}
        {sprints.map((sprint) => (
          <Collapsible key={sprint.id} open={expandedSprints.includes(sprint.id)}>
            {renderSprintHeader(sprint)}
            <CollapsibleContent className="mt-4">
              <div
                className={`grid gap-4 pl-12 min-h-[100px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                  dragOverTarget === sprint.id ? "border-primary bg-primary/5" : "border-transparent"
                }`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, sprint.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, sprint.id)}
              >
                {getTasksBySprint(sprint.id).map((task) => (
                  <Card
                    key={task.id}
                    className="hover:shadow-md transition-shadow cursor-pointer group relative"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardHeader className="pb-3 pl-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2">{task.description}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTask(task)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTask(task.id)
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pl-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{task.assignee}</span>
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {getTasksBySprint(sprint.id).length === 0 && (
                  <div
                    className={`text-center py-8 text-muted-foreground transition-colors ${
                      dragOverTarget === sprint.id ? "text-primary" : ""
                    }`}
                  >
                    {dragOverTarget === sprint.id ? "Drop task here" : "No tasks in this sprint yet."}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Backlog (Unassigned Tasks) */}
        <Collapsible open={expandedSprints.includes("backlog")}>
          {renderBacklogHeader()}
          <CollapsibleContent className="mt-4">
            <div
              className={`grid gap-4 pl-12 min-h-[100px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                dragOverTarget === "backlog" ? "border-primary bg-primary/5" : "border-transparent"
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, null)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, null)}
            >
              {getTasksBySprint(null).map((task) => (
                <Card
                  key={task.id}
                  className="hover:shadow-md transition-shadow cursor-pointer group relative"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardHeader className="pb-3 pl-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{task.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">{task.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTask(task)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTask(task.id)
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pl-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{task.assignee}</span>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {getTasksBySprint(null).length === 0 && (
                <div
                  className={`text-center py-8 text-muted-foreground transition-colors ${
                    dragOverTarget === "backlog" ? "text-primary" : ""
                  }`}
                >
                  {dragOverTarget === "backlog" ? "Drop task here" : "No unassigned tasks in backlog."}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        sprints={sprints}
      />

      <SprintModal
        isOpen={isCreateSprintModalOpen}
        onClose={() => setIsCreateSprintModalOpen(false)}
        onSubmit={handleCreateSprint}
      />

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          sprints={sprints}
        />
      )}
      <ToastNotification toasts={toasts} onRemoveToast={removeToast} />
    </div>
  )
}
