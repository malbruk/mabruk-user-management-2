namespace Mabruk.UserManagement.Api.Domain.Entities;

public class OrganizationCourse
{
    public long Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public long? OrganizationId { get; set; }
    public long? CourseId { get; set; }

    public Organization? Organization { get; set; }
    public Course? Course { get; set; }
}
