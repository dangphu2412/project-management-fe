export type Task = {
    id: string;
    title: string;
    description?: string;
    userStoryId?: string;
    sprintId: string | null;
    assignee?: string;
    priority: string;
    tags: string[];
    dueDate: string;
    status: string;
};

interface TaskApiClient {
    getAll(): Promise<Task[]>;
}

export const taskApiClient: TaskApiClient = {
    getAll(): Promise<Task[]> {
        return Promise.resolve([
            {
                id: "task-1",
                title: "Implement JWT authentication",
                description: "Add JWT token-based authentication system",
                priority: "high",
                assignee: "John Doe",
                tags: ["backend", "security"],
                dueDate: "2024-02-15",
                status: "backlog",
                userStoryId: "story-1",
                sprintId: "sprint-1",
            },
            {
                id: "task-2",
                title: "Create login form UI",
                description: "Design and implement the login form interface",
                priority: "medium",
                assignee: "Jane Smith",
                tags: ["frontend", "ui"],
                dueDate: "2024-02-10",
                status: "backlog",
                userStoryId: "story-1",
                sprintId: "sprint-1",
            },
            {
                id: "task-3",
                title: "Set up user database schema",
                description: "Create database tables for user management",
                priority: "high",
                assignee: "Mike Johnson",
                tags: ["backend", "database"],
                dueDate: "2024-02-20",
                status: "backlog",
                userStoryId: "story-2",
                sprintId: "sprint-2",
            },
            {
                id: "task-4",
                title: "Design dashboard wireframes",
                description: "Create wireframes for the main dashboard interface",
                priority: "medium",
                assignee: "Jane Smith",
                tags: ["design", "ui"],
                dueDate: "2024-02-25",
                status: "backlog",
                userStoryId: "story-3",
                sprintId: null,
            },
        ]);
    }
}

