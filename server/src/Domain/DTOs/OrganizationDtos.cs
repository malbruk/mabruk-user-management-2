using System.ComponentModel.DataAnnotations;

namespace Mabruk.UserManagement.Api.Domain.DTOs;

public record OrganizationDto(long Id, DateTime CreatedAt, string? Name);

public record OrganizationDetailsDto(OrganizationDto Organization, IReadOnlyCollection<GroupDto> Groups, IReadOnlyCollection<CourseDto> Courses);

public record GroupDto(long Id, DateTime CreatedAt, string? Name, long? OrganizationId);

public record CreateOrganizationRequest
{
    [Required]
    [MaxLength(255)]
    public string Name { get; init; } = string.Empty;
}

public record UpdateOrganizationRequest
{
    [Required]
    [MaxLength(255)]
    public string Name { get; init; } = string.Empty;
}

public record CreateGroupRequest
{
    [Required]
    public long OrganizationId { get; init; }

    [Required]
    [MaxLength(255)]
    public string Name { get; init; } = string.Empty;
}

public record UpdateGroupRequest
{
    [Required]
    [MaxLength(255)]
    public string Name { get; init; } = string.Empty;
}

public record AssignCourseRequest
{
    [Required]
    public long CourseId { get; init; }
}
