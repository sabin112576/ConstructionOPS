namespace ConstructionOPS.Server.Features.Projects.Contracts;

public sealed record ProjectResponse
(
    Guid ProjectId,
    string ProjectCode,
    string Name,
    string? Description,
    short Status,
    DateOnly? StartDate,
    DateOnly? PlannedEndDate,
    decimal ContractValue,
    string CurrencyCode,
    string ClientName
);