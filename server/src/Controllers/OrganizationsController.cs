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
public class OrganizationsController(ApplicationDbContext dbContext) : ControllerBase
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    [HttpGet]
    public async Task<ActionResult<PagedResult<OrganizationDto>>> GetOrganizations(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = _dbContext.Organizations.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim()}%";
            query = query.Where(o => o.Name != null && EF.Functions.ILike(o.Name, pattern));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(o => o.ToDto())
            .ToListAsync(cancellationToken);

        return Ok(new PagedResult<OrganizationDto>(items, page, pageSize, total));
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<OrganizationDetailsDto>> GetOrganization(long id, CancellationToken cancellationToken)
    {
        var organization = await _dbContext.Organizations
            .Include(o => o.Groups)
            .Include(o => o.Courses)
                .ThenInclude(oc => oc.Course)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

        if (organization is null)
        {
            return NotFound();
        }

        var groupDtos = organization.Groups
            .Select(g => g.ToDto())
            .OrderByDescending(g => g.CreatedAt)
            .ToList();

        var courseDtos = organization.Courses
            .Where(oc => oc.Course is not null)
            .Select(oc => oc.Course!.ToDto())
            .OrderBy(c => c.Name)
            .ToList();

        var dto = new OrganizationDetailsDto(organization.ToDto(), groupDtos, courseDtos);
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<OrganizationDto>> CreateOrganization(
        [FromBody] CreateOrganizationRequest request,
        CancellationToken cancellationToken)
    {
        var entity = new Organization
        {
            Name = request.Name.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Organizations.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetOrganization), new { id = entity.Id }, entity.ToDto());
    }

    [HttpPut("{id:long}")]
    public async Task<ActionResult<OrganizationDto>> UpdateOrganization(
        long id,
        [FromBody] UpdateOrganizationRequest request,
        CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Organizations.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        entity.Name = request.Name.Trim();
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity.ToDto());
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteOrganization(long id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Organizations.FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        _dbContext.Organizations.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:long}/courses")]
    public async Task<ActionResult<CourseDto>> AssignCourseToOrganization(
        long id,
        [FromBody] AssignCourseRequest request,
        CancellationToken cancellationToken)
    {
        var organizationExists = await _dbContext.Organizations.AnyAsync(o => o.Id == id, cancellationToken);
        if (!organizationExists)
        {
            return NotFound($"Organization {id} was not found.");
        }

        var course = await _dbContext.Courses.FirstOrDefaultAsync(c => c.Id == request.CourseId, cancellationToken);
        if (course is null)
        {
            return NotFound($"Course {request.CourseId} was not found.");
        }

        var alreadyAssigned = await _dbContext.OrganizationCourses
            .AnyAsync(oc => oc.OrganizationId == id && oc.CourseId == request.CourseId, cancellationToken);

        if (alreadyAssigned)
        {
            return Conflict("Course is already assigned to this organization.");
        }

        var entity = new OrganizationCourse
        {
            OrganizationId = id,
            CourseId = request.CourseId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.OrganizationCourses.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetOrganization), new { id }, course.ToDto());
    }

    [HttpDelete("{id:long}/courses/{organizationCourseId:long}")]
    public async Task<IActionResult> RemoveCourseFromOrganization(
        long id,
        long organizationCourseId,
        CancellationToken cancellationToken)
    {
        var entity = await _dbContext.OrganizationCourses
            .FirstOrDefaultAsync(oc => oc.Id == organizationCourseId && oc.OrganizationId == id, cancellationToken);

        if (entity is null)
        {
            return NotFound();
        }

        _dbContext.OrganizationCourses.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
