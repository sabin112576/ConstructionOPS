using ConstructionOPS.Server.Infrastructure.Database;
using Dapper;
using System.Reflection;

namespace ConstructionOPS.Server.Infrastructure.Persistence.Migrations;

public sealed class MigrationRunner
{
    private readonly IDbConnectionFactory _connectionFactory;

    public MigrationRunner(IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task MigrateAsync(
        CancellationToken cancellationToken = default)
    {
        using var connection = _connectionFactory.CreateConnection();

        await connection.OpenAsync(cancellationToken);

        await connection.ExecuteAsync(
            """
            CREATE TABLE IF NOT EXISTS schema_migrations
            (
                version VARCHAR(50) PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """);

        var assembly = Assembly.GetExecutingAssembly();

        var migrations = assembly
            .GetManifestResourceNames()
            .Where(x => x.EndsWith(".sql"))
            .OrderBy(x => x)
            .ToList();

        foreach (var migration in migrations)
        {
            var version = ExtractVersion(migration);

            var alreadyApplied = await connection.ExecuteScalarAsync<bool>(
                """
                SELECT EXISTS
                (
                    SELECT 1
                    FROM schema_migrations
                    WHERE version = @Version
                );
                """,
                new { Version = version });

            if (alreadyApplied)
                continue;

            await using var stream =
                assembly.GetManifestResourceStream(migration)
                ?? throw new InvalidOperationException(
                    $"Migration '{migration}' could not be loaded.");

            using var reader = new StreamReader(stream);

            var sql = await reader.ReadToEndAsync(cancellationToken);

            using var transaction = connection.BeginTransaction();

            try
            {
                await connection.ExecuteAsync(
                    sql,
                    transaction: transaction);

                await connection.ExecuteAsync(
                    """
                    INSERT INTO schema_migrations(version)
                    VALUES (@Version);
                    """,
                    new { Version = version },
                    transaction);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
    }

    private static string ExtractVersion(string resourceName)
    {
        var fileName = resourceName.Split('.')
            .TakeLast(3)
            .First();

        return fileName;
    }
}