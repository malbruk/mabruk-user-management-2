namespace Mabruk.UserManagement.Api.Domain.Entities;

public class Subscriber
{
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? FullName { get; set; }
    public string Email { get; set; } = null!;
    public long? CustomerIdSumit { get; set; }
    public string? PaymentDetails { get; set; }
    public string? Type { get; set; }
    public string? GithubUser { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Phone { get; set; }
    public string? Plan { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Group { get; set; }

    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
