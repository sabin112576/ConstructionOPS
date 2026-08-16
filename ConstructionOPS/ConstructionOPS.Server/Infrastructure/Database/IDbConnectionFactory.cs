using Npgsql;

namespace ConstructionOPS.Server.Infrastructure.Database;

public interface IDbConnectionFactory
{
    NpgsqlConnection CreateConnection();
}