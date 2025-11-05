using System.ComponentModel.DataAnnotations;

namespace Mabruk.UserManagement.Api.Domain.DTOs;

public record SubscriptionDto(
    long Id,
    DateTime CreatedAt,
    long? SubscriberId,
    string? Course,
    DateOnly? StartDate,
    DateOnly? EndDate,
    long? GroupId);

public record CreateSubscriptionRequest
{
    [Required]
    public long SubscriberId { get; init; }

    [Required]
    [MaxLength(255)]
    public string Course { get; init; } = string.Empty;

    public DateOnly? StartDate { get; init; }
    public DateOnly? EndDate { get; init; }
    public long? GroupId { get; init; }
}

public record UpdateSubscriptionRequest
{
    [Required]
    public long SubscriberId { get; init; }

    [Required]
    [MaxLength(255)]
    public string Course { get; init; } = string.Empty;

    public DateOnly? StartDate { get; init; }
    public DateOnly? EndDate { get; init; }
    public long? GroupId { get; init; }
}
