import {SidebarTrigger} from "@/shared/design-system/components/ui/sidebar";
import {BacklogAction} from "@/features/backlog/backlog-header/backlog-actions/backlog-action";
import {BacklogFilter} from "@/features/backlog/backlog-filters/backlog-filter";
import type React from "react";

export function BacklogHeader() {
    return <div className="p-6 border-b bg-background">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div>
                    <h1 className="text-2xl font-bold">Backlog</h1>
                    <p className="text-muted-foreground">Manage user stories, sprints and tasks</p>
                </div>
            </div>
            <BacklogAction />
        </div>

        <BacklogFilter />
    </div>
}