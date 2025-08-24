import {Sprint} from "@/features/backlog/shared/sprints/sprint-api-client";
import {SprintView, TaskView, UserStoryView} from "@/features/backlog/backlog-list/backlog-list.store";
import {Task} from "@/features/backlog/shared/tasks/task-api-client";
import {UserStory} from "@/features/backlog/shared/user-story/user-story-api-client";

// TODO: We will adapt with API real model later
export function fromSprintToSprintView(sprints: Sprint[]): SprintView[] {
    return sprints.map(sprint => {
        return {
            ...sprint,
        }
    })
}

export function fromTaskToTaskView(tasks: Task[]): TaskView[] {
    return tasks.map(task => {
        return {
            ...task,
        }
    })
}

export function fromUserStoryToUserStoryView(userStories: UserStory[]): UserStoryView[] {
    return userStories.map(userStory => {
        return {
            ...userStory,
        }
    })
}