export type UserStory = {
    id: string;
    title: string;
    description?: string;
    acceptanceCriteria: string;
    priority: string;
    status: string;
    tags: string[];
    storyPoints: string;
    priorityId?: string;
    assignee?: string;
    sprintId: string | null;
};

interface UserStoryApiClient {
    getAll(): Promise<UserStory[]>;
}

export const userStoryApiClient: UserStoryApiClient = {
    getAll(): Promise<UserStory[]> {
        return Promise.resolve([
                {
                    id: "story-1",
                    title: "As a user, I want to log into the system so that I can access my dashboard",
                    description: "Users need a secure way to authenticate and access their personalized dashboard",
                    acceptanceCriteria:
                        "Given a valid user, when they enter correct credentials, then they should be logged in and redirected to dashboard",
                    priority: "high",
                    storyPoints: "5",
                    assignee: "John Doe",
                    tags: ["authentication", "security"],
                    sprintId: "sprint-1",
                    status: "backlog",
                },
                {
                    id: "story-2",
                    title: "As an admin, I want to manage user accounts so that I can control system access",
                    description: "Administrators need the ability to create, update, and deactivate user accounts",
                    acceptanceCriteria: "Given admin privileges, when managing users, then all CRUD operations should be available",
                    priority: "medium",
                    storyPoints: "8",
                    assignee: "Jane Smith",
                    tags: ["admin", "user-management"],
                    sprintId: "sprint-2",
                    status: "backlog",
                },
                {
                    id: "story-3",
                    title: "As a user, I want to view my task dashboard so that I can track my work",
                    description: "Users need a comprehensive view of their assigned tasks and progress",
                    acceptanceCriteria:
                        "Given a logged-in user, when they access the dashboard, then they should see their tasks organized by status",
                    priority: "high",
                    storyPoints: "3",
                    assignee: "Mike Johnson",
                    tags: ["dashboard", "tasks"],
                    sprintId: null, // Unassigned to sprint (in backlog)
                    status: "backlog",
                },
            ]
        );
    }
}
