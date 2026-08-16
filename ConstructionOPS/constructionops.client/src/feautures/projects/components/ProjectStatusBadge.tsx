interface ProjectStatusBadgeProps {
    status: number;
}

const statuses: Record<
    number,
    {
        label: string;
        className: string;
    }
> = {
    1: {
        label: "Planning",
        className: "status-planning"
    },

    2: {
        label: "Active",
        className: "status-active"
    },

    3: {
        label: "On Hold",
        className: "status-hold"
    },

    4: {
        label: "Completed",
        className: "status-completed"
    },

    5: {
        label: "Cancelled",
        className: "status-cancelled"
    }
};

export default function ProjectStatusBadge({
    status
}: ProjectStatusBadgeProps) {

    const config =
        statuses[status] ??
        {
            label: "Unknown",
            className: "status-unknown"
        };

    return (
        <span
            className={`project-status ${config.className}`}
        >
            {config.label}
        </span>
    );
}