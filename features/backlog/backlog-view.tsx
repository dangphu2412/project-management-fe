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
  GripVertical,
  BookOpen,
  Target,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/shared/design-system/components/ui/button"
import { Input } from "@/shared/design-system/components/ui/input"
import { Badge } from "@/shared/design-system/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/shared/design-system/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/design-system/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/design-system/components/ui/select"
import { TaskModal } from "@/features/tasks/task-modal"
import { TaskDetailModal } from "@/features/tasks/task-detail-modal"
import { UserStoryModal } from "@/features/backlog/user-story-modal"
import { SprintModal } from "@/features/backlog/sprint-modal"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/design-system/components/ui/collapsible"
import { ToastNotification } from "@/shared/design-system/components/toast-notification"
import { SidebarTrigger } from "@/shared/design-system/components/ui/sidebar"

// Mock data with user stories and tasks
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

const mockUserStories = [
  {
    id: "story-1",
    title: "As a user, I want to log into the system so that I can access my dashboard",
    description: "Users need a secure way to authenticate and access their personalized dashboard",
    acceptanceCriteria:
      "Given a valid user, when they enter correct credentials, then they should be logged in and redirected to dashboard",
    priority: "high",
    storyPoints: "5",
    assignee: "John Doe",
    tags: ["authentication", "security"],
    sprintId: "sprint-1",
    status: "backlog",
  },
  {
    id: "story-2",
    title: "As an admin, I want to manage user accounts so that I can control system access",
    description: "Administrators need the ability to create, update, and deactivate user accounts",
    acceptanceCriteria: "Given admin privileges, when managing users, then all CRUD operations should be available",
    priority: "medium",
    storyPoints: "8",
    assignee: "Jane Smith",
    tags: ["admin", "user-management"],
    sprintId: "sprint-2",
    status: "backlog",
  },
  {
    id: "story-3",
    title: "As a user, I want to view my task dashboard so that I can track my work",
    description: "Users need a comprehensive view of their assigned tasks and progress",
    acceptanceCriteria:
      "Given a logged-in user, when they access the dashboard, then they should see their tasks organized by status",
    priority: "high",
    storyPoints: "3",
    assignee: "Mike Johnson",
    tags: ["dashboard", "tasks"],
    sprintId: null, // Unassigned to sprint (in backlog)
    status: "backlog",
  },
]

const mockTasks = [
  {
    id: "task-1",
    title: "Implement JWT authentication",
    description: "Add JWT token-based authentication system",
    priority: "high",
    assignee: "John Doe",
    tags: ["backend", "security"],
    dueDate: "2024-02-15",
    status: "backlog",
    userStoryId: "story-1",
    sprintId: "sprint-1",
  },
  {
    id: "task-2",
    title: "Create login form UI",
    description: "Design and implement the login form interface",
    priority: "medium",
    assignee: "Jane Smith",
    tags: ["frontend", "ui"],
    dueDate: "2024-02-10",
    status: "backlog",
    userStoryId: "story-1",
    sprintId: "sprint-1",
  },
  {
    id: "task-3",
    title: "Set up user database schema",
    description: "Create database tables for user management",
    priority: "high",
    assignee: "Mike Johnson",
    tags: ["backend", "database"],
    dueDate: "2024-02-20",
    status: "backlog",
    userStoryId: "story-2",
    sprintId: "sprint-2",
  },
  {
    id: "task-4",
    title: "Design dashboard wireframes",
    description: "Create wireframes for the main dashboard interface",
    priority: "medium",
    assignee: "Jane Smith",
    tags: ["design", "ui"],
    dueDate: "2024-02-25",
    status: "backlog",
    userStoryId: "story-3",
    sprintId: null,
  },
]

export function BacklogView() {
  const [userStories, setUserStories] = useState(mockUserStories)
  const [tasks, setTasks] = useState(mockTasks)
  const [sprints, setSprints] = useState(mockSprints)
  const [isCreateUserStoryModalOpen, setIsCreateUserStoryModalOpen] = useState(false)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false)
  const [selectedUserStory, setSelectedUserStory] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [expandedSprints, setExpandedSprints] = useState<string[]>(["backlog", ...mockSprints.map((s) => s.id)])
  const [expandedStories, setExpandedStories] = useState<string[]>([])

  const [draggedItem, setDraggedItem] = useState<{ id: string; type: "story" | "task" } | null>(null)
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null)

  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([])

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const handleDragStart = (e: React.DragEvent, itemId: string, itemType: "story" | "task") => {
    setDraggedItem({ id: itemId, type: itemType })
    e.dataTransfer.setData("text/plain", itemId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
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
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverTarget(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetSprintId: string | null) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData("text/plain")

    if (!draggedItem || itemId !== draggedItem.id) return

    if (draggedItem.type === "story") {
      const story = userStories.find((s) => s.id === itemId)
      if (!story || story.sprintId === targetSprintId) {
        setDraggedItem(null)
        setDragOverTarget(null)
        return
      }

      // Update user story's sprint assignment
      setUserStories(userStories.map((s) => (s.id === itemId ? { ...s, sprintId: targetSprintId } : s)))

      // Update all tasks in this story to the same sprint
      setTasks(tasks.map((t) => (t.userStoryId === itemId ? { ...t, sprintId: targetSprintId } : t)))

      const targetName = targetSprintId ? sprints.find((s) => s.id === targetSprintId)?.name : "Backlog"
      addToast(`User story "${story.title}" moved to ${targetName}`, "success")
    } else {
      const task = tasks.find((t) => t.id === itemId)
      if (!task || task.sprintId === targetSprintId) {
        setDraggedItem(null)
        setDragOverTarget(null)
        return
      }

      // Update task's sprint assignment
      setTasks(tasks.map((t) => (t.id === itemId ? { ...t, sprintId: targetSprintId } : t)))

      const targetName = targetSprintId ? sprints.find((s) => s.id === targetSprintId)?.name : "Backlog"
      addToast(`Task "${task.title}" moved to ${targetName}`, "success")
    }

    setDraggedItem(null)
    setDragOverTarget(null)
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

  const getSprintStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary-100 text-primary-800"
      case "completed":
        return "bg-slate-100 text-slate-600"
      case "planning":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-slate-100 text-slate-600"
    }
  }

  const filteredUserStories = userStories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = priorityFilter === "all" || story.priority === priorityFilter
    const matchesAssignee = assigneeFilter === "all" || story.assignee === assigneeFilter

    return matchesSearch && matchesPriority && matchesAssignee
  })

  const getStoriesBySprint = (sprintId: string | null) => {
    return filteredUserStories.filter((story) => story.sprintId === sprintId)
  }

  const getTasksByStory = (storyId: string) => {
    return tasks.filter((task) => task.userStoryId === storyId)
  }

  const handleCreateUserStory = (storyData: any) => {
    const newStory = {
      id: `story-${Date.now()}`,
      ...storyData,
      status: "backlog",
    }
    setUserStories([...userStories, newStory])
    addToast(`User story "${newStory.title}" created successfully`, "success")
  }

  const handleCreateTask = (taskData: any) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...taskData,
      status: "backlog",
    }
    setTasks([...tasks, newTask])
    addToast(`Task "${newTask.title}" created successfully`, "success")
  }

  const handleCreateSprint = (sprintData: any) => {
    const newSprint = {
      id: `sprint-${Date.now()}`,
      ...sprintData,
      status: "planning",
    }
    setSprints([...sprints, newSprint])
    setExpandedSprints([...expandedSprints, newSprint.id])
    addToast(`Sprint "${newSprint.name}" created successfully`, "success")
  }

  const handleUpdateUserStory = (storyData: any) => {
    setUserStories(userStories.map((story) => (story.id === storyData.id ? { ...story, ...storyData } : story)))
    addToast(`User story updated successfully`, "success")
  }

  const handleUpdateTask = (taskData: any) => {
    setTasks(tasks.map((task) => (task.id === taskData.id ? { ...task, ...taskData } : task)))
    addToast(`Task updated successfully`, "success")
  }

  const handleDeleteUserStory = (storyId: string) => {
    const story = userStories.find((s) => s.id === storyId)
    setUserStories(userStories.filter((story) => story.id !== storyId))
    // Also delete associated tasks
    setTasks(tasks.filter((task) => task.userStoryId !== storyId))
    if (story) {
      addToast(`User story "${story.title}" deleted successfully`, "success")
    }
  }

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    setTasks(tasks.filter((task) => task.id !== taskId))
    if (task) {
      addToast(`Task "${task.title}" deleted successfully`, "success")
    }
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

  const toggleStoryExpansion = (storyId: string) => {
    setExpandedStories((prev) => (prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]))
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
            <Badge className={getSprintStatusColor(sprint.status)}>{sprint.status}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {getStoriesBySprint(sprint.id).length} stories
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
            <BookOpen className="h-3 w-3" />
            {getStoriesBySprint(null).length} stories
          </div>
        </div>
      </div>
    </div>
  )

  const renderUserStoryCard = (story: any) => {
    const storyTasks = getTasksByStory(story.id)
    const isExpanded = expandedStories.includes(story.id)

    return (
      <Card
        key={story.id}
        className="hover:shadow-md transition-shadow cursor-pointer group relative border-l-4 border-l-primary-500"
        draggable
        onDragStart={(e) => handleDragStart(e, story.id, "story")}
        onDragEnd={handleDragEnd}
      >
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardHeader className="pb-3 pl-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-primary-600" />
                <Badge className={getPriorityColor(story.priority)}>{story.priority}</Badge>
                {story.storyPoints && (
                  <Badge variant="outline" className="bg-primary-50 text-primary-700">
                    {story.storyPoints} pts
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">{story.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{story.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{story.assignee}</span>
                <span>{storyTasks.length} tasks</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleStoryExpansion(story.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
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
                      setSelectedUserStory(story)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Story
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteUserStory(story.id)
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Story
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pl-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {story.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tasks under story */}
          {isExpanded && storyTasks.length > 0 && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Target className="h-3 w-3" />
                Tasks ({storyTasks.length})
              </h4>
              {storyTasks.map((task) => (
                <Card
                  key={task.id}
                  className="ml-4 hover:shadow-sm transition-shadow cursor-pointer group relative bg-muted/20"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, "task")}
                  onDragEnd={handleDragEnd}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedTask(task)
                  }}
                >
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <CardContent className="p-3 pl-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm mb-1">{task.title}</h5>
                        <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getPriorityColor(task.priority)} variant="outline">
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                        </div>
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
                              setSelectedTask(task)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Task
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Backlog</h1>
              <p className="text-muted-foreground">Manage user stories, sprints and tasks</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCreateSprintModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Sprint
            </Button>
            <Button variant="outline" onClick={() => setIsCreateTaskModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button onClick={() => setIsCreateUserStoryModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User Story
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search user stories..."
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
              <SelectItem value="critical">Critical</SelectItem>
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
                  dragOverTarget === sprint.id ? "border-primary-500 bg-primary-50" : "border-transparent"
                }`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, sprint.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, sprint.id)}
              >
                {getStoriesBySprint(sprint.id).map((story) => renderUserStoryCard(story))}
                {getStoriesBySprint(sprint.id).length === 0 && (
                  <div
                    className={`text-center py-8 text-muted-foreground transition-colors ${
                      dragOverTarget === sprint.id ? "text-primary-600" : ""
                    }`}
                  >
                    {dragOverTarget === sprint.id ? "Drop user story here" : "No user stories in this sprint yet."}
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        {/* Backlog (Unassigned User Stories) */}
        <Collapsible open={expandedSprints.includes("backlog")}>
          {renderBacklogHeader()}
          <CollapsibleContent className="mt-4">
            <div
              className={`grid gap-4 pl-12 min-h-[100px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                dragOverTarget === "backlog" ? "border-primary-500 bg-primary-50" : "border-transparent"
              }`}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, null)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, null)}
            >
              {getStoriesBySprint(null).map((story) => renderUserStoryCard(story))}
              {getStoriesBySprint(null).length === 0 && (
                <div
                  className={`text-center py-8 text-muted-foreground transition-colors ${
                    dragOverTarget === "backlog" ? "text-primary-600" : ""
                  }`}
                >
                  {dragOverTarget === "backlog" ? "Drop user story here" : "No unassigned user stories in backlog."}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Modals */}
      <UserStoryModal
        isOpen={isCreateUserStoryModalOpen}
        onClose={() => setIsCreateUserStoryModalOpen(false)}
        onSubmit={handleCreateUserStory}
        sprints={sprints}
      />

      <TaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        sprints={sprints}
        userStories={userStories}
      />

      <SprintModal
        isOpen={isCreateSprintModalOpen}
        onClose={() => setIsCreateSprintModalOpen(false)}
        onSubmit={handleCreateSprint}
      />

      {selectedUserStory && (
        <UserStoryModal
          isOpen={!!selectedUserStory}
          onClose={() => setSelectedUserStory(null)}
          onSubmit={handleUpdateUserStory}
          userStory={selectedUserStory}
          sprints={sprints}
        />
      )}

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
