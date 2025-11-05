using System.ComponentModel.DataAnnotations;

namespace Mabruk.UserManagement.Api.Domain.DTOs;

public record SubscriberDto(
    long Id,
    DateTime CreatedAt,
    string? FullName,
    string Email,
    long? CustomerIdSumit,
    string? PaymentDetails,
    string? Type,
    string? GithubUser,
    string? FirstName,
    string? LastName,
    string? Phone,
    string? Plan,
    DateOnly? StartDate,
    DateOnly? EndDate,
    string? Group);

public record CreateSubscriberRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    public string? FullName { get; init; }
    public long? CustomerIdSumit { get; init; }
    public string? PaymentDetails { get; init; }
    public string? Type { get; init; }
    public string? GithubUser { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Phone { get; init; }
    public string? Plan { get; init; }
    public DateOnly? StartDate { get; init; }
    public DateOnly? EndDate { get; init; }
    public string? Group { get; init; }
}

public record UpdateSubscriberRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    public string? FullName { get; init; }
    public long? CustomerIdSumit { get; init; }
    public string? PaymentDetails { get; init; }
    public string? Type { get; init; }
    public string? GithubUser { get; init; }
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
    public string? Phone { get; init; }
    public string? Plan { get; init; }
    public DateOnly? StartDate { get; init; }
    public DateOnly? EndDate { get; init; }
    public string? Group { get; init; }
}
