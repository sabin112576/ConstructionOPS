using ConstructionOPS.Server.Features.Projects.Contracts;
using ConstructionOPS.Server.Features.Projects.Domain;
using ConstructionOPS.Server.Features.Projects.Repositories;

namespace ConstructionOPS.Server.Features.Projects.Services;

public sealed class ProjectService : IProjectService
{
    private readonly IProjectRepository _repository;

    // Temporary development tenant.
    // Authentication will replace this.
    private static readonly Guid TenantId =
        Guid.Parse("5870d0be-9c37-4ef6-b369-77c039b16b6a");

    public ProjectService(
        IProjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<ProjectResponse>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        var projects =
            await _repository.GetAllAsync(
                TenantId,
                cancellationToken);

        return projects
            .Select(ToResponse)
            .ToList();
    }

    public async Task<ProjectResponse?> GetByIdAsync(
        Guid projectId,
        CancellationToken cancellationToken)
    {
        var project =
            await _repository.GetByIdAsync(
                TenantId,
                projectId,
                cancellationToken);

        return project is null
            ? null
            : ToResponse(project);
    }

    public async Task<ProjectResponse> CreateAsync(
        CreateProjectRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.ProjectCode))
            throw new ArgumentException(
                "Project code is required.");

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException(
                "Project name is required.");

        if (request.ContractValue < 0)
            throw new ArgumentException(
                "Contract value cannot be negative.");

        if (request.PlannedEndDate.HasValue &&
            request.StartDate.HasValue &&
            request.PlannedEndDate < request.StartDate)
        {
            throw new ArgumentException(
                "Planned end date cannot be before start date.");
        }

        var exists =
            await _repository.ExistsAsync(
                TenantId,
                request.ProjectCode,
                cancellationToken);

        if (exists)
            throw new InvalidOperationException(
                $"Project code '{request.ProjectCode}' already exists.");

        var project = new Project
        {
            ProjectId = Guid.NewGuid(),

            TenantId = TenantId,

            CompanyId = request.CompanyId,

            ClientId = request.ClientId,

            ProjectCode =
                request.ProjectCode.Trim().ToUpperInvariant(),

            Name = request.Name.Trim(),

            Description = request.Description?.Trim(),

            Status = 1,

            StartDate = request.StartDate,

            PlannedEndDate = request.PlannedEndDate,

            ContractValue = request.ContractValue,

            CurrencyCode =
                string.IsNullOrWhiteSpace(request.CurrencyCode)
                    ? "INR"
                    : request.CurrencyCode.ToUpperInvariant()
        };

        var created =
            await _repository.CreateAsync(
                project,
                cancellationToken);

        return ToResponse(created);
    }

    private static ProjectResponse ToResponse(
        Project project)
    {
        return new ProjectResponse(
            project.ProjectId,
            project.ProjectCode,
            project.Name,
            project.Description,
            project.Status,
            project.StartDate,
            project.PlannedEndDate,
            project.ContractValue,
            project.CurrencyCode,
            project.ClientName);
    }
}