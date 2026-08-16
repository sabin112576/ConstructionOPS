import { useNavigate } from "react-router-dom";

import ProjectCard
    from "../components/ProjectCard";

import ProjectTable
    from "../components/ProjectTable";

import { useProjects }
    from "../hooks/useProjects";

import Loading
    from "../../../components/common/Loading";

import ErrorMessage
    from "../../../components/common/ErrorMessage";

export default function ProjectsPage() {

    const navigate = useNavigate();

    const {
        projects,
        loading,
        error,
        reload
    } = useProjects();

    if (loading) {
        return (
            <Loading
                message="Loading projects..."
            />
        );
    }

    if (error) {
        return (
            <ErrorMessage
                message={error}
                onRetry={reload}
            />
        );
    }

    return (
        <main className="projects-page">

            <header className="page-header">

                <div>
                    <h1>
                        Projects
                    </h1>

                    <p>
                        Manage construction projects,
                        budgets and site operations.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate("/projects/new")
                    }
                >
                    + New Project
                </button>

            </header>

            {projects.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No projects yet
                    </h2>

                    <p>
                        Create your first construction
                        project to get started.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/projects/new")
                        }
                    >
                        Create Project
                    </button>

                </div>

            ) : (

                <>

                    <section className="project-cards">

                        {projects.map(project => (
                            <ProjectCard
                                key={project.projectId}
                                project={project}
                            />
                        ))}

                    </section>

                    <section className="projects-section">

                        <div className="section-header">

                            <h2>
                                All Projects
                            </h2>

                            <span>
                                {projects.length} projects
                            </span>

                        </div>

                        <ProjectTable
                            projects={projects}
                        />

                    </section>

                </>

            )}

        </main>
    );
}