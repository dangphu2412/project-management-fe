"use client"

import { Calendar, Kanban, List, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "backlog", label: "Backlog", icon: List },
    { id: "active-sprint", label: "Active Sprint", icon: Kanban },
    { id: "timeline", label: "Timeline", icon: Calendar },
  ]

  return (
    <div className="w-64 bg-muted/30 border-r flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">TaskFlow</h1>
        <p className="text-sm text-muted-foreground">Project Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeView === item.id ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-3", activeView === item.id && "bg-secondary")}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3">
          <User className="h-4 w-4" />
          Profile
        </Button>
      </div>
    </div>
  )
}
