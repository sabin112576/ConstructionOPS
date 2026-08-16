namespace ConstructionOPS.Server.Features.Projects.Contracts;

public sealed record CreateProjectRequest
(
    Guid CompanyId,
    Guid ClientId,

    string ProjectCode,
    string Name,

    string? Description,

    DateOnly? StartDate,
    DateOnly? PlannedEndDate,

    decimal ContractValue,

    string CurrencyCode
);