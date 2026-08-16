import { useCallback, useEffect, useState } from "react";

import { getProjects } from "../api/projectsApi";

import type { Project } from "../types/project";

export function useProjects() {

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const loadProjects = useCallback(
        async () => {

            try {

                setLoading(true);
                setError(null);

                const result =
                    await getProjects();

                setProjects(result);

            } catch (error) {

                setError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load projects."
                );

            } finally {

                setLoading(false);
            }

        },
        []
    );

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    return {
        projects,
        loading,
        error,
        reload: loadProjects
    };
}