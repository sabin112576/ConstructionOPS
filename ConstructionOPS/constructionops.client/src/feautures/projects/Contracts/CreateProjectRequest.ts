// contracts/CreateProjectRequest.ts

export interface CreateProjectRequest {
    companyId: string;
    clientId: string;
    projectCode: string;
    name: string;
    description?: string;
    startDate?: string;
    plannedEndDate?: string;
    contractValue: number;
    currencyCode: string;
}