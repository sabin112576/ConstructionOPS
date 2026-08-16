namespace ConstructionOPS.Server.Features.Projects.Domain;

public sealed class Project
{
    public Guid ProjectId { get; init; }

    public Guid TenantId { get; init; }
    public Guid CompanyId { get; init; }
    public Guid ClientId { get; init; }

    public string ProjectCode { get; init; } = string.Empty;

    public string Name { get; init; } = string.Empty;

    public string? Description { get; init; }

    public short Status { get; init; }

    public DateOnly? StartDate { get; init; }

    public DateOnly? PlannedEndDate { get; init; }

    public DateOnly? ActualEndDate { get; init; }

    public decimal ContractValue { get; init; }

    public string CurrencyCode { get; init; } = "INR";

    public DateTime CreatedAt { get; init; }

    public DateTime? UpdatedAt { get; init; }

    public string ClientName { get; init; } = string.Empty;
}