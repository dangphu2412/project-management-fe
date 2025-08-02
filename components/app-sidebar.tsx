"use client"

import { Calendar, Kanban, List, Settings, User, ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AppSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

// Mock data for sidebar stats
const sidebarStats = {
  backlogTasks: 12,
  activeTasks: 8,
  upcomingDeadlines: 3,
}

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar()

  const menuItems = [
    {
      id: "backlog",
      label: "Backlog",
      icon: List,
      badge: sidebarStats.backlogTasks,
      description: "Manage sprints and tasks",
    },
    {
      id: "active-sprint",
      label: "Active Sprint",
      icon: Kanban,
      badge: sidebarStats.activeTasks,
      description: "Current work in progress",
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: Calendar,
      badge: sidebarStats.upcomingDeadlines,
      description: "Deadlines and history",
    },
  ]

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Kanban className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">TaskFlow</span>
              <span className="truncate text-xs text-muted-foreground">Project Management</span>
            </div>
          </div>
        </div>
        <Separator />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.id

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={state === "collapsed" ? item.label : undefined}
                    >
                      <button onClick={() => onViewChange(item.id)} className="flex w-full items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge > 0 && (
                          <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Tasks</span>
                <span className="font-medium">{sidebarStats.backlogTasks + sidebarStats.activeTasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-medium">{sidebarStats.activeTasks}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Due Soon</span>
                <span className="font-medium text-orange-600">{sidebarStats.upcomingDeadlines}</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Activity */}
        <SidebarGroup>
          <SidebarGroupLabel>Recent Activity</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-2 py-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="truncate">Task completed</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="truncate">Sprint started</span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="truncate">New task assigned</span>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">John Doe</span>
                    <span className="truncate text-xs text-muted-foreground">john@example.com</span>
                  </div>
                  <ChevronRight className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">John Doe</span>
                      <span className="truncate text-xs text-muted-foreground">john@example.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
