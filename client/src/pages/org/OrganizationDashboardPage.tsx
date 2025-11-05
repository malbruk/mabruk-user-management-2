import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { courses, organizations, subscribers, subscriptions } from '../../data/mockData';
import { formatDate } from '../../utils/date';

const statusLabels: Record<string, string> = {
  active: 'פעיל',
  trial: 'תקופת ניסיון',
  paused: 'מוקפא'
};

const statusTone: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  active: 'success',
  trial: 'info',
  paused: 'warning'
};

const getFilterLabel = (filter: string | null) => {
  switch (filter) {
    case 'active':
      return 'מנויים פעילים';
    case 'trial':
      return 'בתקופת ניסיון';
    case 'paused':
      return 'מנויים מוקפאים';
    default:
      return 'כל המנויים';
  }
};

export const OrganizationDashboardPage = () => {
  const params = useParams();
  const organizationId = Number(params.organizationId ?? 0) || 1;
  const organization = organizations.find((org) => org.id === organizationId) ?? organizations[0];
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const computed = useMemo(() => {
    const orgSubscribers = subscribers.filter((subscriber) => subscriber.organizationId === organization.id);
    const filteredSubscribers = statusFilter
      ? orgSubscribers.filter((subscriber) => subscriber.status === statusFilter)
      : orgSubscribers;

    const orgSubscriptions = subscriptions.filter((subscription) =>
      orgSubscribers.some((subscriber) => subscriber.id === subscription.subscriberId)
    );

    const activeCourses = organization.courseIds.map((courseId) => courses.find((course) => course.id === courseId));

    return {
      orgSubscribers,
      filteredSubscribers,
      orgSubscriptions,
      activeCourses
    };
  }, [organization.id, statusFilter]);

  const counts = useMemo(() => {
    const totals = {
      active: 0,
      trial: 0,
      paused: 0
    };
    computed.orgSubscribers.forEach((subscriber) => {
      totals[subscriber.status as keyof typeof totals] += 1;
    });
    return totals;
  }, [computed.orgSubscribers]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-slate-500">מבט ארגון</p>
        <h2 className="text-2xl font-semibold text-slate-800">{organization.name}</h2>
        <p className="text-sm text-slate-500">
          {organization.groups.length} קבוצות • {organization.courseIds.length} קורסים זמינים
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="מנויים פעילים"
          value={counts.active}
          subtitle="משתמשים עם גישה מלאה"
          accent="primary"
        />
        <StatCard
          title="בתקופת ניסיון"
          value={counts.trial}
          subtitle="זמן טוב ליצירת קשר אישי"
          accent="secondary"
        />
        <StatCard
          title="מוקפאים"
          value={counts.paused}
          subtitle="שווה לבדוק מה ניתן לשפר"
          accent="accent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card title="פעילויות אחרונות">
          <ul className="space-y-4">
            {computed.filteredSubscribers.slice(0, 3).map((subscriber) => {
              const courseNames = computed.orgSubscriptions
                .filter((subscription) => subscription.subscriberId === subscriber.id)
                .map((subscription) => courses.find((course) => course.id === subscription.courseId)?.name)
                .filter(Boolean)
                .join(', ');

              return (
                <li key={subscriber.id} className="flex items-start justify-between gap-4 text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-800">{subscriber.fullName}</p>
                    <p className="text-xs text-slate-500">{statusLabels[subscriber.status]}</p>
                    <p className="text-xs text-slate-500">קורסים: {courseNames || '—'}</p>
                  </div>
                  <span className="text-xs text-slate-500">{formatDate(subscriber.startDate)}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="קורסים באור הזרקורים">
          <ul className="space-y-3 text-sm text-slate-600">
            {computed.activeCourses.map((course) =>
              course ? (
                <li key={course.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{course.name}</p>
                    <p className="text-xs text-slate-500">{course.durationDays} ימים</p>
                  </div>
                  <span className="text-xs text-slate-500">{course.price.toLocaleString('he-IL')} ₪</span>
                </li>
              ) : null
            )}
          </ul>
        </Card>
      </div>

      <div className="space-y-4">
        <SectionHeader
          title={getFilterLabel(statusFilter)}
          description="ניהול רשימת המנויים בארגון לפי סטטוס"
          actions={
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {['all', 'active', 'trial', 'paused'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status === 'all' ? null : status)}
                  className={`rounded-full px-4 py-2 transition ${
                    (status === 'all' && !statusFilter) || statusFilter === status
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status === 'all' ? 'כל המנויים' : statusLabels[status]}
                </button>
              ))}
            </div>
          }
        />

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-3 pb-3">שם מלא</th>
                  <th className="px-3 pb-3">אימייל</th>
                  <th className="px-3 pb-3">קבוצה</th>
                  <th className="px-3 pb-3">סטטוס</th>
                  <th className="px-3 pb-3">התחלה</th>
                  <th className="px-3 pb-3">סיום</th>
                  <th className="px-3 pb-3">קורסים פעילים</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {computed.filteredSubscribers.map((subscriber) => {
                  const group = organization.groups.find((g) => g.id === subscriber.groupId);
                  const courseNames = computed.orgSubscriptions
                    .filter((subscription) => subscription.subscriberId === subscriber.id)
                    .map((subscription) => courses.find((course) => course.id === subscription.courseId)?.name)
                    .filter(Boolean)
                    .join(', ');
                  return (
                    <tr key={subscriber.id} className="text-slate-700">
                      <td className="px-3 py-3 text-slate-800">{subscriber.fullName}</td>
                      <td className="px-3 py-3 text-slate-600">{subscriber.email}</td>
                      <td className="px-3 py-3 text-slate-600">{group?.name ?? '—'}</td>
                      <td className="px-3 py-3">
                        <StatusBadge label={statusLabels[subscriber.status]} tone={statusTone[subscriber.status]} />
                      </td>
                      <td className="px-3 py-3 text-slate-600">{formatDate(subscriber.startDate)}</td>
                      <td className="px-3 py-3 text-slate-600">{formatDate(subscriber.endDate)}</td>
                      <td className="px-3 py-3 text-slate-600">{courseNames || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationDashboardPage;
