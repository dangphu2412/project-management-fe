"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BacklogView } from "@/components/backlog-view"
import { ActiveSprintView } from "@/components/active-sprint-view"
import { TimelineView } from "@/components/timeline-view"

export default function TaskManagement() {
  const [activeView, setActiveView] = useState("backlog")

  const renderView = () => {
    switch (activeView) {
      case "backlog":
        return <BacklogView />
      case "active-sprint":
        return <ActiveSprintView />
      case "timeline":
        return <TimelineView />
      default:
        return <BacklogView />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />
      <SidebarInset>
        <main className="flex-1 overflow-hidden">{renderView()}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
