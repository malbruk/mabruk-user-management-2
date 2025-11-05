namespace Mabruk.UserManagement.Api.Domain.Entities;

public class Course
{
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Name { get; set; }
    public long? Price { get; set; }
    public long? Duration { get; set; }

    public ICollection<OrganizationCourse> Organizations { get; set; } = new List<OrganizationCourse>();
}
