import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getProject
} from "../api/projectsApi";

import type {
    Project
} from "../types/project";

import ProjectStatusBadge
    from "../components/ProjectStatusBadge";

import Loading
    from "../../../components/common/Loading";

export default function ProjectDetailsPage() {

    const { projectId } =
        useParams();

    const navigate =
        useNavigate();

    const [project, setProject] =
        useState<Project | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {

        async function load() {

            if (!projectId)
                return;

            try {

                const result =
                    await getProject(projectId);

                setProject(result);

            } catch (error) {

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load project."
                );

            } finally {

                setLoading(false);
            }
        }

        load();

    }, [projectId]);

    if (loading) {
        return (
            <Loading
                message="Loading project..."
            />
        );
    }

    if (error || !project) {

        return (
            <main>
                <h2>
                    Project not found
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/projects")
                    }
                >
                    Back to Projects
                </button>
            </main>
        );
    }

    return (
        <main className="project-details">

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

                    <div className="project-title">

                        <div>

                            <span className="project-code">
                                {project.projectCode}
                            </span>

                            <h1>
                                {project.name}
                            </h1>

                        </div>

                        <ProjectStatusBadge
                            status={project.status}
                        />

                    </div>

                    <p>
                        {project.clientName}
                    </p>

                </div>

            </header>

            <section className="project-overview">

                <div className="overview-card">

                    <span>
                        Contract Value
                    </span>

                    <strong>
                        {project.currencyCode}{" "}
                        {project.contractValue.toLocaleString(
                            "en-IN"
                        )}
                    </strong>

                </div>

                <div className="overview-card">

                    <span>
                        Start Date
                    </span>

                    <strong>
                        {project.startDate
                            ? new Date(
                                project.startDate
                            ).toLocaleDateString(
                                "en-IN"
                            )
                            : "Not set"}
                    </strong>

                </div>

                <div className="overview-card">

                    <span>
                        Planned Completion
                    </span>

                    <strong>
                        {project.plannedEndDate
                            ? new Date(
                                project.plannedEndDate
                            ).toLocaleDateString(
                                "en-IN"
                            )
                            : "Not set"}
                    </strong>

                </div>

            </section>

            <section className="project-module-grid">

                <button>
                    Budget
                </button>

                <button>
                    Costs
                </button>

                <button>
                    Materials
                </button>

                <button>
                    Labour
                </button>

                <button>
                    Equipment
                </button>

                <button>
                    Subcontractors
                </button>

                <button>
                    Site Information
                </button>

                <button>
                    Inspections
                </button>

                <button>
                    Documents
                </button>

            </section>

        </main>
    );
}