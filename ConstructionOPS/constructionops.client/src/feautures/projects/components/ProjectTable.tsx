import { useNavigate } from "react-router-dom";

import type { Project } from "../types/project";

import ProjectStatusBadge
    from "./ProjectStatusBadge";

interface ProjectTableProps {
    projects: Project[];
}

export default function ProjectTable({
    projects
}: ProjectTableProps) {

    const navigate = useNavigate();

    return (
        <div className="project-table-container">

            <table className="project-table">

                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Client</th>
                        <th>Status</th>
                        <th>Contract Value</th>
                        <th>Planned End</th>
                    </tr>
                </thead>

                <tbody>

                    {projects.map(project => (

                        <tr
                            key={project.projectId}
                            onClick={() =>
                                navigate(
                                    `/projects/${project.projectId}`
                                )
                            }
                        >

                            <td>

                                <strong>
                                    {project.name}
                                </strong>

                                <small>
                                    {project.projectCode}
                                </small>

                            </td>

                            <td>
                                {project.clientName}
                            </td>

                            <td>
                                <ProjectStatusBadge
                                    status={project.status}
                                />
                            </td>

                            <td>
                                {project.currencyCode}{" "}
                                {project.contractValue.toLocaleString(
                                    "en-IN"
                                )}
                            </td>

                            <td>
                                {project.plannedEndDate
                                    ? new Date(
                                        project.plannedEndDate
                                    ).toLocaleDateString(
                                        "en-IN"
                                    )
                                    : "—"}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}