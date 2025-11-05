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
public class SubscribersController(ApplicationDbContext dbContext) : ControllerBase
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    [HttpGet]
    public async Task<ActionResult<PagedResult<SubscriberDto>>> GetSubscribers(
        [FromQuery] string? email,
        [FromQuery] string? plan,
        [FromQuery] string? type,
        [FromQuery] string? group,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var query = _dbContext.Subscribers.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(email))
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();
            query = query.Where(s => s.Email == normalizedEmail);
        }

        if (!string.IsNullOrWhiteSpace(plan))
        {
            query = query.Where(s => s.Plan == plan.Trim());
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            query = query.Where(s => s.Type == type.Trim());
        }

        if (!string.IsNullOrWhiteSpace(group))
        {
            query = query.Where(s => s.Group == group.Trim());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim()}%";
            query = query.Where(s =>
                (s.FullName != null && EF.Functions.ILike(s.FullName, pattern)) ||
                (s.FirstName != null && EF.Functions.ILike(s.FirstName, pattern)) ||
                (s.LastName != null && EF.Functions.ILike(s.LastName, pattern)));
        }

        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(s => s.ToDto())
            .ToListAsync(cancellationToken);

        return Ok(new PagedResult<SubscriberDto>(items, page, pageSize, total));
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<SubscriberDto>> GetSubscriber(long id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Subscribers.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        return Ok(entity.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<SubscriberDto>> CreateSubscriber([FromBody] CreateSubscriberRequest request, CancellationToken cancellationToken)
    {
        if (request.EndDate.HasValue && request.StartDate.HasValue && request.EndDate < request.StartDate)
        {
            return BadRequest("End date cannot be earlier than start date.");
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailExists = await _dbContext.Subscribers.AnyAsync(s => s.Email == normalizedEmail, cancellationToken);
        if (emailExists)
        {
            return Conflict("A subscriber with the same email already exists.");
        }

        var entity = new Subscriber
        {
            Email = normalizedEmail,
            FullName = request.FullName?.Trim(),
            CustomerIdSumit = request.CustomerIdSumit,
            PaymentDetails = request.PaymentDetails,
            Type = request.Type?.Trim(),
            GithubUser = request.GithubUser?.Trim(),
            FirstName = request.FirstName?.Trim(),
            LastName = request.LastName?.Trim(),
            Phone = request.Phone?.Trim(),
            Plan = request.Plan?.Trim(),
            StartDate = request.StartDate ?? DateOnly.FromDateTime(DateTime.UtcNow.Date),
            EndDate = request.EndDate,
            Group = request.Group?.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Subscribers.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetSubscriber), new { id = entity.Id }, entity.ToDto());
    }

    [HttpPut("{id:long}")]
    public async Task<ActionResult<SubscriberDto>> UpdateSubscriber(long id, [FromBody] UpdateSubscriberRequest request, CancellationToken cancellationToken)
    {
        if (request.EndDate.HasValue && request.StartDate.HasValue && request.EndDate < request.StartDate)
        {
            return BadRequest("End date cannot be earlier than start date.");
        }

        var entity = await _dbContext.Subscribers.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailConflict = await _dbContext.Subscribers
            .AnyAsync(s => s.Email == normalizedEmail && s.Id != id, cancellationToken);
        if (emailConflict)
        {
            return Conflict("Another subscriber with the same email already exists.");
        }

        entity.Email = normalizedEmail;
        entity.FullName = request.FullName?.Trim();
        entity.CustomerIdSumit = request.CustomerIdSumit;
        entity.PaymentDetails = request.PaymentDetails;
        entity.Type = request.Type?.Trim();
        entity.GithubUser = request.GithubUser?.Trim();
        entity.FirstName = request.FirstName?.Trim();
        entity.LastName = request.LastName?.Trim();
        entity.Phone = request.Phone?.Trim();
        entity.Plan = request.Plan?.Trim();
        entity.StartDate = request.StartDate ?? entity.StartDate;
        entity.EndDate = request.EndDate;
        entity.Group = request.Group?.Trim();

        await _dbContext.SaveChangesAsync(cancellationToken);

        return Ok(entity.ToDto());
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteSubscriber(long id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Subscribers.FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        if (entity is null)
        {
            return NotFound();
        }

        _dbContext.Subscribers.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
