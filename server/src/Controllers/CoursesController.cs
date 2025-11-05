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
public class CoursesController(ApplicationDbContext dbContext) : ControllerBase
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    [HttpGet]
    public async Task<ActionResult<PagedResult<CourseDto>>> GetCourses(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = _dbContext.Courses.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim()}%";
            query = query.Where(c => c.Name != null && EF.Functions.ILike(c.Name, pattern));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => c.ToDto())
            .ToListAsync(cancellationToken);

        return Ok(new PagedResult<CourseDto>(items, page, pageSize, total));
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<CourseDto>> GetCourse(long id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Courses.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        return Ok(entity.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<CourseDto>> CreateCourse([FromBody] CreateCourseRequest request, CancellationToken cancellationToken)
    {
        var entity = new Course
        {
            Name = request.Name.Trim(),
            Price = request.Price,
            Duration = request.Duration,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Courses.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetCourse), new { id = entity.Id }, entity.ToDto());
    }

    [HttpPut("{id:long}")]
    public async Task<ActionResult<CourseDto>> UpdateCourse(long id, [FromBody] UpdateCourseRequest request, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Courses.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        entity.Name = request.Name.Trim();
        entity.Price = request.Price;
        entity.Duration = request.Duration;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity.ToDto());
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteCourse(long id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Courses.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        _dbContext.Courses.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
