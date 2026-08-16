import { Route } from "react-router-dom";

import ProjectsPage
    from "./pages/ProjectsPage";

import ProjectCreatePage
    from "./pages/ProjectCreatePage";

import ProjectDetailsPage
    from "./pages/ProjectsDetailsPage";

export function projectRoutes() {
    return (
        <>
            <Route
                path="/projects"
                element={<ProjectsPage />}
            />

            <Route
                path="/projects/new"
                element={<ProjectCreatePage />}
            />

            <Route
                path="/projects/:projectId"
                element={<ProjectDetailsPage />}
            />
        </>
    );
}