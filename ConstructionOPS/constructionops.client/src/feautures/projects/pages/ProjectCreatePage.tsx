import {
    useNavigate
} from "react-router-dom";

import {
    useState
} from "react";

import {
    createProject
} from "../api/projectsApi";

import ProjectForm
    from "../components/ProjectForm";

export default function ProjectCreatePage() {

    const navigate = useNavigate();

    const [submitting, setSubmitting] =
        useState(false);

    // Temporary development IDs.
    // These will come from Company/Client APIs.
    const companyId =
        "Yf3a9c21-4d68-4b72-9e15-83c6f0a2b941";

    const clientId =
        "c52e7816-9a34-46bd-b0f7-2d8e5c913a67";

    async function handleCreate(
        request: Parameters<
            typeof createProject
        >[0]
    ) {

        try {

            setSubmitting(true);

            const project =
                await createProject(request);

            navigate(
                `/projects/${project.projectId}`
            );

        } finally {

            setSubmitting(false);
        }
    }

    return (
        <main className="project-create-page">

            <header className="page-header">

                <div>

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/projects")
                        }
                    >
                        ← Projects
                    </button>

                    <h1>
                        Create Project
                    </h1>

                    <p>
                        Set up a new construction project.
                    </p>

                </div>

            </header>

            <ProjectForm
                companyId={companyId}
                clientId={clientId}
                onSubmit={handleCreate}
                submitting={submitting}
            />

        </main>
    );
}