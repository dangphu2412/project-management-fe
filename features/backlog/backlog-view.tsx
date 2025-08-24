"use client"

import type React from "react"
import {BacklogActionProvider} from "@/features/backlog/backlog-header/backlog-actions/store/provider";
import {BacklogFilterProvider} from "@/features/backlog/backlog-filters/store/backlog-filter.store";
import {BacklogHeader} from "@/features/backlog/backlog-header/backlog-header";
import {BacklogList} from "@/features/backlog/backlog-list/backlog-list";


export function BacklogView() {
  return (
      <BacklogActionProvider>
        <BacklogFilterProvider>
          <div className="flex flex-col h-full">
            <BacklogHeader />
            <BacklogList />
          </div>
        </BacklogFilterProvider>
      </BacklogActionProvider>
  )
}
