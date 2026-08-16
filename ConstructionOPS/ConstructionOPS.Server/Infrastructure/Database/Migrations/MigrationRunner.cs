using ConstructionOPS.Server.Infrastructure.Database;
using Dapper;
using System.Reflection;

namespace ConstructionOPS.Server.Infrastructure.Persistence.Migrations;

public sealed class MigrationRunner
{
    private readonly IDbConnectionFactory _connectionFactory;

    public MigrationRunner(
        IDbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task MigrateAsync(
        CancellationToken cancellationToken = default)
    {
        await using var connection =
            _connectionFactory.CreateConnection();

        await connection.OpenAsync(cancellationToken);

        // Migration history table
        await connection.ExecuteAsync(
            """
            CREATE SCHEMA IF NOT EXISTS audit;

            CREATE TABLE IF NOT EXISTS audit.schema_migration
            (
                version VARCHAR(100) PRIMARY KEY,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """);

        var assembly =
            Assembly.GetExecutingAssembly();

        var migrations = assembly
            .GetManifestResourceNames()
            .Where(x => x.EndsWith(".sql"))
            .OrderBy(x => x)
            .ToList();

        foreach (var migration in migrations)
        {
            var version =
                ExtractVersion(migration);

            var alreadyApplied =
                await connection.ExecuteScalarAsync<bool>(
                    """
                    SELECT EXISTS
                    (
                        SELECT 1
                        FROM audit.schema_migration
                        WHERE version = @Version
                    );
                    """,
                    new
                    {
                        Version = version
                    });

            if (alreadyApplied)
                continue;

            await using var stream =
                assembly.GetManifestResourceStream(migration)
                ?? throw new InvalidOperationException(
                    $"Migration '{migration}' could not be loaded.");

            using var reader =
                new StreamReader(stream);

            var sql =
                await reader.ReadToEndAsync(
                    cancellationToken);

            await using var transaction =
                await connection.BeginTransactionAsync(
                    cancellationToken);

            try
            {
                await connection.ExecuteAsync(
                    sql,
                    transaction: transaction);

                await connection.ExecuteAsync(
                    """
                    INSERT INTO audit.schema_migration
                    (
                        version
                    )
                    VALUES
                    (
                        @Version
                    );
                    """,
                    new
                    {
                        Version = version
                    },
                    transaction);

                await transaction.CommitAsync(
                    cancellationToken);
            }
            catch
            {
                await transaction.RollbackAsync(
                    cancellationToken);

                throw;
            }
        }
    }

    private static string ExtractVersion(
        string resourceName)
    {
        var fileName =
            resourceName
                .Split('.')
                .TakeLast(2)
                .First();

        return fileName;
    }
}