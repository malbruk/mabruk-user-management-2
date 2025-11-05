using System.ComponentModel.DataAnnotations;

namespace Mabruk.UserManagement.Api.Domain.DTOs;

public record CourseDto(long Id, DateTime CreatedAt, string? Name, long? Price, long? Duration);

public record CreateCourseRequest
{
    [Required]
    [MaxLength(255)]
    public string Name { get; init; } = string.Empty;

    public long? Price { get; init; }

    public long? Duration { get; init; }
}

public record UpdateCourseRequest
{
    [Required]
    [MaxLength(255)]
    public string Name { get; init; } = string.Empty;

    public long? Price { get; init; }

    public long? Duration { get; init; }
}
