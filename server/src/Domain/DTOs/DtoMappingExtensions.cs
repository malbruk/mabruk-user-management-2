using Mabruk.UserManagement.Api.Domain.Entities;

namespace Mabruk.UserManagement.Api.Domain.DTOs;

public static class DtoMappingExtensions
{
    public static OrganizationDto ToDto(this Organization entity) =>
        new(entity.Id, entity.CreatedAt, entity.Name);

    public static GroupDto ToDto(this OrganizationGroup entity) =>
        new(entity.Id, entity.CreatedAt, entity.Name, entity.OrganizationId);

    public static CourseDto ToDto(this Course entity) =>
        new(entity.Id, entity.CreatedAt, entity.Name, entity.Price, entity.Duration);

    public static SubscriberDto ToDto(this Subscriber entity) =>
        new(
            entity.Id,
            entity.CreatedAt,
            entity.FullName,
            entity.Email,
            entity.CustomerIdSumit,
            entity.PaymentDetails,
            entity.Type,
            entity.GithubUser,
            entity.FirstName,
            entity.LastName,
            entity.Phone,
            entity.Plan,
            entity.StartDate,
            entity.EndDate,
            entity.Group);

    public static SubscriptionDto ToDto(this Subscription entity) =>
        new(
            entity.Id,
            entity.CreatedAt,
            entity.SubscriberId,
            entity.Course,
            entity.StartDate,
            entity.EndDate,
            entity.GroupId);
}
