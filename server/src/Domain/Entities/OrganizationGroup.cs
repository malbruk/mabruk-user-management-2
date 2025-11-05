namespace Mabruk.UserManagement.Api.Domain.Entities;

public class OrganizationGroup
{
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Name { get; set; }
    public long? OrganizationId { get; set; }

    public Organization? Organization { get; set; }
    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}
