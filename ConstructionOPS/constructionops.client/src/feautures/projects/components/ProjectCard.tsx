import { useNavigate } from "react-router-dom";

import type { Project } from "../types/project";

import ProjectStatusBadge
    from "./ProjectStatusBadge";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({
    project
}: ProjectCardProps) {

    const navigate = useNavigate();

    return (
        <article
            className="project-card"
            onClick={() =>
                navigate(
                    `/projects/${project.projectId}`
                )
            }
        >

            <div className="project-card-top">

                <span className="project-code">
                    {project.projectCode}
                </span>

                <ProjectStatusBadge
                    status={project.status}
                />

            </div>

            <h3>
                {project.name}
            </h3>

            <p className="project-client">
                {project.clientName}
            </p>

            {project.description && (
                <p className="project-description">
                    {project.description}
                </p>
            )}

            <div className="project-card-footer">

                <div>
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

                <div>
                    <span>
                        Planned End
                    </span>

                    <strong>
                        {project.plannedEndDate
                            ? new Date(
                                project.plannedEndDate
                            ).toLocaleDateString(
                                "en-IN"
                            )
                            : "—"}
                    </strong>
                </div>

            </div>

        </article>
    );
}