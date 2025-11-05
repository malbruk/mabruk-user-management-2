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
public class SubscriptionsController(ApplicationDbContext dbContext) : ControllerBase
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    [HttpGet]
    public async Task<ActionResult<PagedResult<SubscriptionDto>>> GetSubscriptions(
        [FromQuery] long? subscriberId,
        [FromQuery] long? groupId,
        [FromQuery] string? course,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = _dbContext.Subscriptions.AsNoTracking();

        if (subscriberId.HasValue)
        {
            query = query.Where(s => s.SubscriberId == subscriberId.Value);
        }

        if (groupId.HasValue)
        {
            query = query.Where(s => s.GroupId == groupId.Value);
        }

        if (!string.IsNullOrWhiteSpace(course))
        {
            var pattern = $"%{course.Trim()}%";
            query = query.Where(s => s.Course != null && EF.Functions.ILike(s.Course, pattern));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => s.ToDto())
            .ToListAsync(cancellationToken);

        return Ok(new PagedResult<SubscriptionDto>(items, page, pageSize, total));
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<SubscriptionDto>> GetSubscription(long id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Subscriptions.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        return Ok(entity.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<SubscriptionDto>> CreateSubscription([FromBody] CreateSubscriptionRequest request, CancellationToken cancellationToken)
    {
        if (request.EndDate.HasValue && request.StartDate.HasValue && request.EndDate < request.StartDate)
        {
            return BadRequest("End date cannot be earlier than start date.");
        }

        var subscriberExists = await _dbContext.Subscribers.AnyAsync(s => s.Id == request.SubscriberId, cancellationToken);
        if (!subscriberExists)
        {
            return NotFound($"Subscriber {request.SubscriberId} was not found.");
        }

        if (request.GroupId.HasValue)
        {
            var groupExists = await _dbContext.Groups.AnyAsync(g => g.Id == request.GroupId.Value, cancellationToken);
            if (!groupExists)
            {
                return NotFound($"Group {request.GroupId.Value} was not found.");
            }
        }

        var entity = new Subscription
        {
            SubscriberId = request.SubscriberId,
            Course = request.Course,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            GroupId = request.GroupId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Subscriptions.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetSubscription), new { id = entity.Id }, entity.ToDto());
    }

    [HttpPut("{id:long}")]
    public async Task<ActionResult<SubscriptionDto>> UpdateSubscription(long id, [FromBody] UpdateSubscriptionRequest request, CancellationToken cancellationToken)
    {
        if (request.EndDate.HasValue && request.StartDate.HasValue && request.EndDate < request.StartDate)
        {
            return BadRequest("End date cannot be earlier than start date.");
        }

        var entity = await _dbContext.Subscriptions.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        var subscriberExists = await _dbContext.Subscribers.AnyAsync(s => s.Id == request.SubscriberId, cancellationToken);
        if (!subscriberExists)
        {
            return NotFound($"Subscriber {request.SubscriberId} was not found.");
        }

        if (request.GroupId.HasValue)
        {
            var groupExists = await _dbContext.Groups.AnyAsync(g => g.Id == request.GroupId.Value, cancellationToken);
            if (!groupExists)
            {
                return NotFound($"Group {request.GroupId.Value} was not found.");
            }
        }

        entity.SubscriberId = request.SubscriberId;
        entity.Course = request.Course;
        entity.StartDate = request.StartDate;
        entity.EndDate = request.EndDate;
        entity.GroupId = request.GroupId;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity.ToDto());
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteSubscription(long id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Subscriptions.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        _dbContext.Subscriptions.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
