using Mabruk.UserManagement.Api.Data;
using Mabruk.UserManagement.Api.Domain.DTOs;
using Mabruk.UserManagement.Api.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Mabruk.UserManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GroupsController(ApplicationDbContext dbContext) : ControllerBase
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    [HttpGet]
    public async Task<ActionResult<PagedResult<GroupDto>>> GetGroups(
        [FromQuery] long? organizationId,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = _dbContext.Groups.AsNoTracking();

        if (organizationId.HasValue)
        {
            query = query.Where(g => g.OrganizationId == organizationId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim()}%";
            query = query.Where(g => g.Name != null && EF.Functions.ILike(g.Name, pattern));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(g => g.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(g => g.ToDto())
            .ToListAsync(cancellationToken);

        return Ok(new PagedResult<GroupDto>(items, page, pageSize, total));
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<GroupDto>> GetGroup(long id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Groups.AsNoTracking().FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        return Ok(entity.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<GroupDto>> CreateGroup([FromBody] CreateGroupRequest request, CancellationToken cancellationToken)
    {
        var organizationExists = await _dbContext.Organizations.AnyAsync(o => o.Id == request.OrganizationId, cancellationToken);
        if (!organizationExists)
        {
            return NotFound($"Organization {request.OrganizationId} was not found.");
        }

        var entity = new OrganizationGroup
        {
            Name = request.Name.Trim(),
            OrganizationId = request.OrganizationId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Groups.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetGroup), new { id = entity.Id }, entity.ToDto());
    }

    [HttpPut("{id:long}")]
    public async Task<ActionResult<GroupDto>> UpdateGroup(long id, [FromBody] UpdateGroupRequest request, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        entity.Name = request.Name.Trim();
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity.ToDto());
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteGroup(long id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Groups.FirstOrDefaultAsync(g => g.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        _dbContext.Groups.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
