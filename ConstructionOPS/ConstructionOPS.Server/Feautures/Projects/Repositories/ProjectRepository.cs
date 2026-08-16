using Dapper;
using ConstructionOPS.Server.Features.Projects.Domain;
using ConstructionOPS.Server.Infrastructure.Database;

namespace ConstructionOPS.Server.Features.Projects.Repositories;

public sealed class ProjectRepository : IProjectRepository
{
    private readonly IDbConnectionFactory _connectionFactory;

    public ProjectRepository(
        IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IReadOnlyList<Project>> GetAllAsync(
    Guid tenantId,
    CancellationToken cancellationToken)
    {
        await using var connection =
            _connectionFactory.CreateConnection();

        await connection.OpenAsync(cancellationToken);

        const string sql = """
        SELECT *
        FROM projects.get_all(@TenantId);
        """;

        var command = new CommandDefinition(
            sql,
            new
            {
                TenantId = tenantId
            },
            cancellationToken: cancellationToken);

        var result =
            await connection.QueryAsync<Project>(command);

        return result.AsList();
    }

    public async Task<Project?> GetByIdAsync(
    Guid tenantId,
    Guid projectId,
    CancellationToken cancellationToken)
    {
        await using var connection =
            _connectionFactory.CreateConnection();

        await connection.OpenAsync(cancellationToken);

        const string sql = """
        SELECT *
        FROM projects.get_by_id(
            @TenantId,
            @ProjectId
        );
        """;

        var command = new CommandDefinition(
            sql,
            new
            {
                TenantId = tenantId,
                ProjectId = projectId
            },
            cancellationToken: cancellationToken);

        return await connection
            .QuerySingleOrDefaultAsync<Project>(command);
    }

    public async Task<bool> ExistsAsync(
    Guid tenantId,
    string projectCode,
    CancellationToken cancellationToken)
    {
        await using var connection =
            _connectionFactory.CreateConnection();

        await connection.OpenAsync(cancellationToken);

        const string sql = """
        SELECT projects.exists(
            @TenantId,
            @ProjectCode
        );
        """;

        var command = new CommandDefinition(
            sql,
            new
            {
                TenantId = tenantId,
                ProjectCode = projectCode
            },
            cancellationToken: cancellationToken);

        return await connection
            .ExecuteScalarAsync<bool>(command);
    }
    public async Task<Project> CreateAsync(
    Project project,
    CancellationToken cancellationToken)
    {
        await using var connection =
            _connectionFactory.CreateConnection();

        await connection.OpenAsync(cancellationToken);

        const string sql = """
        SELECT *
        FROM projects.create(
            @ProjectId,
            @TenantId,
            @CompanyId,
            @ClientId,
            @ProjectCode,
            @Name,
            @Description,
            @Status,
            @StartDate,
            @PlannedEndDate,
            @ContractValue,
            @CurrencyCode
        );
        """;

        var command = new CommandDefinition(
            sql,
            project,
            cancellationToken: cancellationToken);

        return await connection
            .QuerySingleAsync<Project>(command);
    }
}