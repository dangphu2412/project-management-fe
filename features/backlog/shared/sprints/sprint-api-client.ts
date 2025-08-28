import {apiClient} from "@/shared/api-client";

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
        return apiClient.request({
            url: '/sprints'
        })
    }
}
