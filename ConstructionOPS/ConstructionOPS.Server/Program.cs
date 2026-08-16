using Asp.Versioning;
using ConstructionOPS.Server.Features.Projects.Repositories;
using ConstructionOPS.Server.Features.Projects.Services;
using ConstructionOPS.Server.Infrastructure.Database;
using ConstructionOPS.Server.Infrastructure.Persistence.Migrations;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services
    .AddApiVersioning(options =>
    {
        options.DefaultApiVersion = new ApiVersion(1, 0);

        options.AssumeDefaultVersionWhenUnspecified = true;

        options.ReportApiVersions = true;
    })
    .AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'VVV";

        options.SubstituteApiVersionInUrl = true;
    });

builder.Services.AddScoped<
    IDbConnectionFactory,
    DbConnectionFactory>();

builder.Services.AddScoped<
    IProjectRepository,
    ProjectRepository>();

builder.Services.AddScoped<
    IProjectService,
    ProjectService>();
builder.Services.AddScoped<MigrationRunner>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var migrationRunner =
        scope.ServiceProvider.GetRequiredService<MigrationRunner>();

    await migrationRunner.MigrateAsync();
}
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();