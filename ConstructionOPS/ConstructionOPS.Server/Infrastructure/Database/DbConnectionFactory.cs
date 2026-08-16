using Npgsql;

namespace ConstructionOPS.Server.Infrastructure.Database;

public sealed class DbConnectionFactory : IDbConnectionFactory
{
    private readonly string _connectionString;

    public DbConnectionFactory(IConfiguration configuration)
    {
        _connectionString =
            configuration.GetConnectionString("ConstructionOPS")
            ?? throw new InvalidOperationException(
                "ConstructionOPS connection string is missing.");
    }

    public NpgsqlConnection CreateConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }
}