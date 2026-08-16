using Asp.Versioning;
using ConstructionOPS.Server.Features.Projects.Contracts;
using ConstructionOPS.Server.Features.Projects.Services;
using Microsoft.AspNetCore.Mvc;

namespace ConstructionOPS.Server.Features.Projects.Controllers;

[ApiController]
[ApiVersion(1.0)]
[Route("api/v{version:apiVersion}/projects")]
public sealed class ProjectsController : ControllerBase
{
    private readonly IProjectService _service;

    public ProjectsController(
        IProjectService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProjectResponse>>> GetAll(
        CancellationToken cancellationToken)
    {
        var projects =
            await _service.GetAllAsync(
                cancellationToken);

        return Ok(projects);
    }

    [HttpGet("{projectId:guid}")]
    public async Task<ActionResult<ProjectResponse>> GetById(
        Guid projectId,
        CancellationToken cancellationToken)
    {
        var project =
            await _service.GetByIdAsync(
                projectId,
                cancellationToken);

        if (project is null)
            return NotFound();

        return Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectResponse>> Create(
        CreateProjectRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var project =
                await _service.CreateAsync(
                    request,
                    cancellationToken);

            return CreatedAtAction(
                nameof(GetById),
                new
                {
                    projectId = project.ProjectId,
                    version = "1.0"
                },
                project);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }
}