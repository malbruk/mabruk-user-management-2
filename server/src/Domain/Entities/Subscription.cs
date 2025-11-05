namespace Mabruk.UserManagement.Api.Domain.Entities;

public class Subscription
{
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public long? SubscriberId { get; set; }
    public string? Course { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public long? GroupId { get; set; }

    public Subscriber? Subscriber { get; set; }
    public OrganizationGroup? Group { get; set; }
}
