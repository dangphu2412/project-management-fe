import {Button} from "@/shared/design-system/components/ui/button";
import {Plus} from "lucide-react";
import React from "react";
import {TaskModal} from "@/features/tasks/task-modal";
import {AddSprintModal} from "@/features/backlog/backlog-header/backlog-actions/add-sprint/add-sprint-modal";
import {AddUserStoryModal} from "@/features/backlog/backlog-header/backlog-actions/add-user-story/add-user-story-modal";
import {TaskDetailModal} from "@/features/tasks/task-detail-modal";
import {
    useBacklogActionDispatch,
    useBacklogActionState
} from "@/features/backlog/backlog-header/backlog-actions/shared/backlog-action-store";
import {useToast} from "@/shared/toast/toast";

export function BacklogAction() {
    const {
        isCreateUserStoryModalOpen,
        isCreateTaskModalOpen,
        isCreateSprintModalOpen,
        selectedUserStory,
        selectedTask,
    } = useBacklogActionState();

    const dispatch = useBacklogActionDispatch();
    const {addToast} = useToast();

    // Handlers (unchanged, just triggering toast + API stubs)
    const handleCreateUserStory = (storyData: any) => {
        const newStory = {
            id: `story-${Date.now()}`,
            ...storyData,
            status: "backlog",
        };
        // Call API
        addToast(`User story "${newStory.title}" created successfully`, "success");
    };

    const handleCreateTask = (taskData: any) => {
        const newTask = {
            id: `task-${Date.now()}`,
            ...taskData,
            status: "backlog",
        };
        // Call API
        addToast(`Task "${newTask.title}" created successfully`, "success");
    };

    const handleCreateSprint = (sprintData: any) => {
        const newSprint = {
            id: `sprint-${Date.now()}`,
            ...sprintData,
            status: "planning",
        };
        // Call API
        addToast(`Sprint "${newSprint.name}" created successfully`, "success");
    };

    const handleUpdateUserStory = (storyData: any) => {
        // Call API
        addToast(`User story updated successfully`, "success");
    };

    const handleUpdateTask = (taskData: any) => {
        // Call API
        addToast(`Task updated successfully`, "success");
    };

    const handleDeleteTask = (taskId: string) => {
        // Call API
        addToast(`Task deleted successfully`, "success");
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="outline"
                onClick={() => dispatch({ type: "OPEN_CREATE_SPRINT_MODAL" })}
            >
                <Plus className="h-4 w-4 mr-2" />
                Create Sprint
            </Button>

            <Button
                variant="outline"
                onClick={() => dispatch({ type: "OPEN_CREATE_TASK_MODAL" })}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
            </Button>

            <Button onClick={() => dispatch({ type: "OPEN_CREATE_USER_STORY_MODAL" })}>
                <Plus className="h-4 w-4 mr-2" />
                Add User Story
            </Button>

            <TaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => dispatch({ type: "CLOSE_CREATE_TASK_MODAL" })}
                onSubmit={handleCreateTask}
                sprints={[]}
                userStories={[]}
            />

            <AddSprintModal
                isOpen={isCreateSprintModalOpen}
                onClose={() => dispatch({ type: "CLOSE_CREATE_SPRINT_MODAL" })}
                onSubmit={handleCreateSprint}
            />

            <AddUserStoryModal
                isOpen={isCreateUserStoryModalOpen}
                onClose={() => dispatch({ type: "CLOSE_CREATE_USER_STORY_MODAL" })}
                onSubmit={handleCreateUserStory}
                sprints={[]} // Load API
            />

            {selectedUserStory && (
                <AddUserStoryModal
                    isOpen={!!selectedUserStory}
                    onClose={() => dispatch({ type: "SET_SELECTED_USER_STORY", payload: null })}
                    onSubmit={handleUpdateUserStory}
                    userStory={selectedUserStory}
                    sprints={[]} // Load API
                />
            )}

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={() => dispatch({ type: "SET_SELECTED_TASK", payload: null })}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    sprints={[]} // Load API
                />
            )}
        </div>
    );
}
