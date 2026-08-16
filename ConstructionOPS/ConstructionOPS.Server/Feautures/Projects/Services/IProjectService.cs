using ConstructionOPS.Server.Features.Projects.Contracts;

namespace ConstructionOPS.Server.Features.Projects.Services;

public interface IProjectService
{
    Task<IReadOnlyList<ProjectResponse>> GetAllAsync(
        CancellationToken cancellationToken);

    Task<ProjectResponse?> GetByIdAsync(
        Guid projectId,
        CancellationToken cancellationToken);

    Task<ProjectResponse> CreateAsync(
        CreateProjectRequest request,
        CancellationToken cancellationToken);
}