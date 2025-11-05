import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { courses, organizations } from '../../data/mockData';

export const CoursesCatalogPage = () => {
  return (
    <div className="space-y-10">
      <SectionHeader
        title="ספריית הקורסים"
        description="רשימת הקורסים הפעילים והארגונים שבחרו בהם."
        actions={
          <button className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90">
            הוספת קורס
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => {
          const organizationMatches = organizations.filter((organization) => organization.courseIds.includes(course.id));
          return (
            <Card
              key={course.id}
              title={`${course.name} • ${course.durationDays} ימים`}
              footer={`${course.price.toLocaleString('he-IL')} ₪ • ${organizationMatches.length} ארגונים`}
            >
              <p className="text-sm text-slate-600">{course.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                {organizationMatches.map((organization) => (
                  <span key={organization.id} className="rounded-full bg-slate-100 px-3 py-1">
                    {organization.name}
                  </span>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesCatalogPage;
