"use client"

import {BacklogActionProvider} from "@/features/backlog/backlog-header/backlog-actions/backlog-action.store";
import {BacklogFilterProvider} from "@/features/backlog/backlog-filters/backlog-filter.store";
import {BacklogHeader} from "@/features/backlog/backlog-header/backlog-header.ui";
import {BacklogList} from "@/features/backlog/backlog-list/backlog-list";
import type React from "react";
import {BacklogListProvider} from "@/features/backlog/backlog-list/backlog-list.store";

export default function TaskManagement() {
  return (
      <BacklogActionProvider>
        <BacklogFilterProvider>
            <BacklogListProvider>
                <div className="flex flex-col h-full">
                    <BacklogHeader />
                    <BacklogList />
                </div>
            </BacklogListProvider>
        </BacklogFilterProvider>
      </BacklogActionProvider>
  )
}
