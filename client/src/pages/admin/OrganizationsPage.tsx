import { Link } from 'react-router-dom';
import { courses, organizations, subscribers } from '../../data/mockData';
import { formatDate } from '../../utils/date';
import { SectionHeader } from '../../components/SectionHeader';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/Card';

const summarizeOrganization = (organizationId: number) => {
  const orgSubscribers = subscribers.filter((subscriber) => subscriber.organizationId === organizationId);
  const active = orgSubscribers.filter((subscriber) => subscriber.status === 'active');
  return {
    totalSubscribers: orgSubscribers.length,
    activeCount: active.length
  };
};

export const OrganizationsPage = () => {
  const totalCourses = organizations.reduce((sum, org) => sum + org.courseIds.length, 0);

  return (
    <div className="space-y-10">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="ארגונים מנוהלים"
          value={organizations.length}
          subtitle="מספר הארגונים המחוברים לפלטפורמה"
          accent="primary"
        />
        <StatCard
          title="שיוכי קורסים"
          value={totalCourses}
          subtitle="כמות הקורסים שהוגדרו עבור כל הארגונים"
          accent="secondary"
        />
        <StatCard
          title="סה"נ מנויים"
          value={subscribers.length}
          subtitle="כולל מנויים פעילים, תקופת ניסיון ומושהים"
          accent="accent"
        />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="ארגונים"
          description="הצצה מהירה על פרטי הארגון, קבוצות, ומנויים פעילים."
          actions={
            <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90">
              ארגון חדש
            </button>
          }
        />
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-3 pb-3">שם</th>
                  <th className="px-3 pb-3">נוצר בתאריך</th>
                  <th className="px-3 pb-3">קבוצות</th>
                  <th className="px-3 pb-3">קורסים זמינים</th>
                  <th className="px-3 pb-3">מנויים פעילים</th>
                  <th className="px-3 pb-3">סה"כ מנויים</th>
                  <th className="px-3 pb-3 text-right">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {organizations.map((organization) => {
                  const summary = summarizeOrganization(organization.id);
                  return (
                    <tr key={organization.id} className="text-slate-700">
                      <td className="px-3 py-3">
                        <div className="font-semibold text-slate-800">{organization.name}</div>
                        <p className="text-xs text-slate-500">{organization.sector}</p>
                      </td>
                      <td className="px-3 py-3 text-slate-600">{formatDate(organization.createdAt)}</td>
                      <td className="px-3 py-3 text-slate-600">{organization.groups.length}</td>
                      <td className="px-3 py-3 text-slate-600">{organization.courseIds.length}</td>
                      <td className="px-3 py-3 text-slate-600">{summary.activeCount}</td>
                      <td className="px-3 py-3 text-slate-600">{summary.totalSubscribers}</td>
                      <td className="px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/organizations/${organization.id}`}
                            className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
                          >
                            פרטי ארגון
                          </Link>
                          <Link
                            to={`/org/${organization.id}/dashboard`}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            מעבר למבט ארגוני
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <SectionHeader
          title="התראות מתוכננות"
          description="אירועים חשובים שעלולים להשפיע על שימוש של לקוחות."
        />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <Card key={course.id} title={course.name}>
              <p className="text-sm text-slate-600">
                {course.description}
              </p>
              <div className="mt-4 text-xs text-slate-500">
                {course.durationDays} ימים • {course.price.toLocaleString('he-IL')} ₪
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationsPage;
