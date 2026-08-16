export interface Project {
    projectId: string;

    projectCode: string;
    name: string;
    description?: string;

    status: number;

    startDate?: string;
    plannedEndDate?: string;
    actualEndDate?: string;

    contractValue: number;
    currencyCode: string;

    clientName: string;
}