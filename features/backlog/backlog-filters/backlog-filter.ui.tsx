import { Filter, Search } from "lucide-react";
import { Input } from "@/shared/design-system/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/design-system/components/ui/select";
import { Button } from "@/shared/design-system/components/ui/button";
import React from "react";
import {useBacklogFilterDispatch, useBacklogFilterState} from "@/features/backlog/backlog-filters/backlog-filter.store";

export function BacklogFilter() {
    const { searchQuery, priorityFilter, assigneeFilter } = useBacklogFilterState();
    const dispatch = useBacklogFilterDispatch();

    return (
        <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search user stories..."
                    value={searchQuery}
                    onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
                    className="pl-10"
                />
            </div>

            <Select value={priorityFilter} onValueChange={(v) => dispatch({ type: "SET_PRIORITY_FILTER", payload: v })}>
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

            <Select value={assigneeFilter} onValueChange={(v) => dispatch({ type: "SET_ASSIGNEE_FILTER", payload: v })}>
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

            <Button variant="outline" size="icon" onClick={() => dispatch({ type: "RESET_FILTERS" })}>
                <Filter className="h-4 w-4" />
            </Button>
        </div>
    );
}
