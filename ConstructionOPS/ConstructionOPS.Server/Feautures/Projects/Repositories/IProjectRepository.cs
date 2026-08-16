using ConstructionOPS.Server.Features.Projects.Domain;

namespace ConstructionOPS.Server.Features.Projects.Repositories;

public interface IProjectRepository
{
    Task<IReadOnlyList<Project>> GetAllAsync(
        Guid tenantId,
        CancellationToken cancellationToken);

    Task<Project?> GetByIdAsync(
        Guid tenantId,
        Guid projectId,
        CancellationToken cancellationToken);

    Task<bool> ExistsAsync(
        Guid tenantId,
        string projectCode,
        CancellationToken cancellationToken);

    Task<Project> CreateAsync(
        Project project,
        CancellationToken cancellationToken);
}