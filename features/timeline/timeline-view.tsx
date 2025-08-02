"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, CheckCircle, AlertCircle, Plus } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

// Mock activity data
const mockActivities = [
  {
    id: "1",
    type: "task_created",
    title: "Task created: Implement user authentication",
    user: "John Doe",
    timestamp: "2024-02-01T10:30:00Z",
    details: "Created new task with high priority",
  },
  {
    id: "2",
    type: "task_status_changed",
    title: "Task moved to In Progress",
    user: "Jane Smith",
    timestamp: "2024-02-01T14:15:00Z",
    details: "Design dashboard wireframes moved from To Do to In Progress",
  },
  {
    id: "3",
    type: "sprint_started",
    title: "Sprint 1 started",
    user: "Mike Johnson",
    timestamp: "2024-02-01T09:00:00Z",
    details: "Sprint 1 - Authentication & Dashboard has begun",
  },
  {
    id: "4",
    type: "task_completed",
    title: "Task completed: Set up database schema",
    user: "Mike Johnson",
    timestamp: "2024-01-31T16:45:00Z",
    details: "Database schema setup completed successfully",
  },
]

// Mock calendar events
const mockEvents = [
  {
    id: "1",
    title: "Sprint 1 Planning",
    date: "2024-02-01",
    type: "meeting",
  },
  {
    id: "2",
    title: "User Authentication Due",
    date: "2024-02-15",
    type: "deadline",
  },
  {
    id: "3",
    title: "Sprint 1 Review",
    date: "2024-02-14",
    type: "meeting",
  },
]

export function TimelineView() {
  const [viewMode, setViewMode] = useState("week")
  const [filterType, setFilterType] = useState("all")

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_created":
        return <Plus className="h-4 w-4 text-blue-500" />
      case "task_status_changed":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "sprint_started":
        return <Calendar className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredActivities = mockActivities.filter((activity) => filterType === "all" || activity.type === filterType)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Timeline</h1>
              <p className="text-muted-foreground">Historical + deadline view</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="task_created">Task Created</SelectItem>
                <SelectItem value="task_status_changed">Status Changed</SelectItem>
                <SelectItem value="task_completed">Task Completed</SelectItem>
                <SelectItem value="sprint_started">Sprint Started</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simple calendar representation */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium p-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2 // Offset for month start
                  const hasEvent = mockEvents.some((event) => new Date(event.date).getDate() === day)

                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square p-2 text-sm border rounded-lg cursor-pointer hover:bg-muted
                        ${day < 1 || day > 31 ? "text-muted-foreground bg-muted/50" : ""}
                        ${hasEvent ? "bg-primary/10 border-primary" : ""}
                      `}
                    >
                      {day > 0 && day <= 31 ? day : ""}
                      {hasEvent && <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>}
                    </div>
                  )
                })}
              </div>

              {/* Upcoming Events */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Upcoming Events</h4>
                <div className="space-y-2">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg border">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-xs text-muted-foreground mb-1">{activity.details}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {activity.user}
                        <span>•</span>
                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
