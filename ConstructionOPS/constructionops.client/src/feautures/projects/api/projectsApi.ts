import { apiClient } from "../../../services/apiclient";

import type {
    Project
} from "../types/project";

import type { CreateProjectRequest } from "../Contracts/CreateProjectRequest"

export function getProjects() {
    return apiClient<Project[]>(
        "/api/v1/projects"
    );
}

export function getProject(projectId: string) {
    return apiClient<Project>(
        `/api/v1/projects/${projectId}`
    );
}

export function createProject(
    request: CreateProjectRequest
) {
    return apiClient<Project>(
        "/api/v1/projects",
        {
            method: "POST",
            body: JSON.stringify(request)
        }
    );
}