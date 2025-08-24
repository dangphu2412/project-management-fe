"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/shared/design-system/components/ui/sidebar"
import { AppSidebar } from "@/features/sidebar/app-sidebar"
import { BacklogView } from "@/features/backlog/backlog-view"
import { ActiveSprintView } from "@/features/sprint/active-sprint-view"
import { TimelineView } from "@/features/timeline/timeline-view"
import {ToastProvider} from "@/shared/toast/toast";

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
      <ToastProvider>
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        <SidebarInset>
          <main className="flex-1 overflow-hidden">{renderView()}</main>
        </SidebarInset>
      </ToastProvider>
    </SidebarProvider>
  )
}
