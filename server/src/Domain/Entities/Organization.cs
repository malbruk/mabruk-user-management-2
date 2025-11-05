namespace Mabruk.UserManagement.Api.Domain.Entities;

public class Organization
{
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Name { get; set; }

    public ICollection<OrganizationGroup> Groups { get; set; } = new List<OrganizationGroup>();
    public ICollection<OrganizationCourse> Courses { get; set; } = new List<OrganizationCourse>();
}
