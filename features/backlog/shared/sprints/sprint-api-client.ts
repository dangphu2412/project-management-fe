export type Sprint = {
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
    goal: string;
};
interface SprintApiClient {
    getAll(): Promise<Sprint[]>;
}

export const sprintApiClient: SprintApiClient = {
    getAll(): Promise<Sprint[]> {
        return Promise.resolve([
            {
                id: "sprint-1",
                name: "Sprint 1 - Authentication & Dashboard",
                status: "planning", // planning, active, completed
                startDate: "2024-02-01",
                endDate: "2024-02-14",
                goal: "Implement user authentication and basic dashboard functionality",
            },
            {
                id: "sprint-2",
                name: "Sprint 2 - User Management",
                status: "planning",
                startDate: "2024-02-15",
                endDate: "2024-02-28",
                goal: "Build comprehensive user management features",
            },
        ]);
    }
}
