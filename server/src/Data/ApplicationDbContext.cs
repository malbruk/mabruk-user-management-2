using Mabruk.UserManagement.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Mabruk.UserManagement.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<OrganizationGroup> Groups => Set<OrganizationGroup>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Subscriber> Subscribers => Set<Subscriber>();
    public DbSet<Subscription> Subscriptions => Set<Subscription>();
    public DbSet<OrganizationCourse> OrganizationCourses => Set<OrganizationCourse>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("public");

        modelBuilder.Entity<Organization>(entity =>
        {
            entity.ToTable("organizations");
            entity.HasKey(e => e.Id).HasName("organizations_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                  .HasColumnName("created_at")
                  .HasColumnType("timestamp with time zone")
                  .HasDefaultValueSql("now()");
            entity.Property(e => e.Name)
                  .HasColumnName("name")
                  .HasColumnType("text");
        });

        modelBuilder.Entity<OrganizationGroup>(entity =>
        {
            entity.ToTable("groups");
            entity.HasKey(e => e.Id).HasName("groups_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                  .HasColumnName("created_at")
                  .HasColumnType("timestamp with time zone")
                  .HasDefaultValueSql("now()");
            entity.Property(e => e.Name)
                  .HasColumnName("name")
                  .HasColumnType("text");
            entity.Property(e => e.OrganizationId)
                  .HasColumnName("organization_id");

            entity.HasOne(d => d.Organization)
                  .WithMany(p => p.Groups)
                  .HasForeignKey(d => d.OrganizationId)
                  .HasConstraintName("groups_organization_id_fkey");
        });

        modelBuilder.Entity<Course>(entity =>
        {
            entity.ToTable("courses");
            entity.HasKey(e => e.Id).HasName("courses_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                  .HasColumnName("created_at")
                  .HasColumnType("timestamp with time zone")
                  .HasDefaultValueSql("now()");
            entity.Property(e => e.Name)
                  .HasColumnName("name")
                  .HasColumnType("text");
            entity.Property(e => e.Price)
                  .HasColumnName("price");
            entity.Property(e => e.Duration)
                  .HasColumnName("duration");
        });

        modelBuilder.Entity<Subscriber>(entity =>
        {
            entity.ToTable("subscribers");
            entity.HasKey(e => e.Id).HasName("subscribers_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                  .HasColumnName("created_at")
                  .HasColumnType("timestamp with time zone")
                  .HasDefaultValueSql("now()");
            entity.Property(e => e.FullName)
                  .HasColumnName("full_name")
                  .HasColumnType("text");
            entity.Property(e => e.Email)
                  .HasColumnName("email")
                  .HasColumnType("text")
                  .IsRequired();
            entity.Property(e => e.CustomerIdSumit)
                  .HasColumnName("customer_id_sumit");
            entity.Property(e => e.PaymentDetails)
                  .HasColumnName("payment_details")
                  .HasColumnType("text");
            entity.Property(e => e.Type)
                  .HasColumnName("type")
                  .HasColumnType("public.subscriber_type");
            entity.Property(e => e.GithubUser)
                  .HasColumnName("github_user")
                  .HasColumnType("text");
            entity.Property(e => e.FirstName)
                  .HasColumnName("first_name")
                  .HasColumnType("text");
            entity.Property(e => e.LastName)
                  .HasColumnName("last_name")
                  .HasColumnType("text");
            entity.Property(e => e.Phone)
                  .HasColumnName("phone")
                  .HasColumnType("text");
            entity.Property(e => e.Plan)
                  .HasColumnName("plan")
                  .HasColumnType("public.plan_type");
            entity.Property(e => e.StartDate)
                  .HasColumnName("start_date")
                  .HasColumnType("date")
                  .HasDefaultValueSql("CURRENT_DATE");
            entity.Property(e => e.EndDate)
                  .HasColumnName("end_date")
                  .HasColumnType("date");
            entity.Property(e => e.Group)
                  .HasColumnName("group")
                  .HasColumnType("text");

            entity.HasIndex(e => e.Email)
                  .IsUnique()
                  .HasDatabaseName("subscribers_email_key");
        });

        modelBuilder.Entity<Subscription>(entity =>
        {
            entity.ToTable("subscriptions");
            entity.HasKey(e => e.Id).HasName("subscriptions_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                  .HasColumnName("created_at")
                  .HasColumnType("timestamp with time zone")
                  .HasDefaultValueSql("now()");
            entity.Property(e => e.SubscriberId)
                  .HasColumnName("subscriber_id");
            entity.Property(e => e.Course)
                  .HasColumnName("course")
                  .HasColumnType("text");
            entity.Property(e => e.StartDate)
                  .HasColumnName("start_date")
                  .HasColumnType("date");
            entity.Property(e => e.EndDate)
                  .HasColumnName("end_date")
                  .HasColumnType("date");
            entity.Property(e => e.GroupId)
                  .HasColumnName("group_id");

            entity.HasOne(d => d.Subscriber)
                  .WithMany(p => p.Subscriptions)
                  .HasForeignKey(d => d.SubscriberId)
                  .HasConstraintName("subscriptions_subscriber_id_fkey");

            entity.HasOne(d => d.Group)
                  .WithMany(p => p.Subscriptions)
                  .HasForeignKey(d => d.GroupId)
                  .HasConstraintName("subscriptions_group_id_fkey");
        });

        modelBuilder.Entity<OrganizationCourse>(entity =>
        {
            entity.ToTable("organizations_courses");
            entity.HasKey(e => e.Id).HasName("organizations_courses_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                  .HasColumnName("created_at")
                  .HasColumnType("timestamp with time zone")
                  .HasDefaultValueSql("now()");
            entity.Property(e => e.OrganizationId)
                  .HasColumnName("organization_id");
            entity.Property(e => e.CourseId)
                  .HasColumnName("course_id");

            entity.HasOne(d => d.Organization)
                  .WithMany(p => p.Courses)
                  .HasForeignKey(d => d.OrganizationId)
                  .HasConstraintName("organizations_courses_organization_id_fkey");

            entity.HasOne(d => d.Course)
                  .WithMany(p => p.Organizations)
                  .HasForeignKey(d => d.CourseId)
                  .HasConstraintName("organizations_courses_course_id_fkey");
        });
    }
}
