namespace Mabruk.UserManagement.Api.Domain.DTOs;

public record PagedResult<T>(IReadOnlyCollection<T> Items, int Page, int PageSize, int TotalCount);
