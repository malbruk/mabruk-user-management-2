import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { courses, organizations, subscribers, subscriptions } from '../../data/mockData';
import { formatDate } from '../../utils/date';

const getToneByStatus = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'trial':
      return 'info';
    case 'paused':
      return 'warning';
    default:
      return 'neutral';
  }
};

export const OrganizationDetailsPage = () => {
  const params = useParams();
  const organizationId = Number(params.organizationId ?? 0);
  const organization = organizations.find((org) => org.id === organizationId);

  const computed = useMemo(() => {
    const orgSubscribers = subscribers.filter((subscriber) => subscriber.organizationId === organizationId);
    const activeSubscribers = orgSubscribers.filter((subscriber) => subscriber.status === 'active');
    const trialSubscribers = orgSubscribers.filter((subscriber) => subscriber.status === 'trial');
    const pausedSubscribers = orgSubscribers.filter((subscriber) => subscriber.status === 'paused');

    const orgSubscriptions = subscriptions.filter((subscription) =>
      orgSubscribers.some((subscriber) => subscriber.id === subscription.subscriberId)
    );

    return {
      orgSubscribers,
      activeSubscribers,
      trialSubscribers,
      pausedSubscribers,
      orgSubscriptions
    };
  }, [organizationId]);

  if (!organization) {
    return (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-slate-800">הארגון לא נמצא.</p>
        <Link to="/admin/organizations" className="text-sm font-semibold text-primary">
          חזרה לרשימת הארגונים
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <button
          onClick={() => window.history.back()}
          className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100"
        >
          ← חזרה
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">{organization.name}</h2>
          <p className="text-sm text-slate-500">{organization.sector} • {organization.city}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="מנויים פעילים" value={computed.activeSubscribers.length} subtitle="כולל צוות מלא" />
        <StatCard
          title="בתקופת ניסיון"
          value={computed.trialSubscribers.length}
          accent="secondary"
          subtitle="מעקב אחרי הרשמות חדשות"
        />
        <StatCard
          title="מושהים"
          value={computed.pausedSubscribers.length}
          accent="accent"
          subtitle="מנויים שדורשים טיפול"
        />
        <StatCard
          title="קורסים זמינים"
          value={organization.courseIds.length}
          accent="secondary"
          subtitle="לפי הסכמים פעילים"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card title="קבוצות בארגון">
          <ul className="space-y-4">
            {organization.groups.map((group) => {
              const manager = organization.users.find((user) => user.id === group.managerId);
              const count = computed.orgSubscribers.filter((subscriber) => subscriber.groupId === group.id).length;
              return (
                <li key={group.id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{group.name}</p>
                    <p className="text-xs text-slate-500">מנהל/ת: {manager?.name ?? 'לא הוגדר'}</p>
                    <p className="text-xs text-slate-500">{group.description}</p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{count} מנויים</div>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card title="קורסים משויכים">
          <ul className="space-y-3">
            {organization.courseIds.map((courseId) => {
              const course = courses.find((c) => c.id === courseId);
              if (!course) return null;
              const subscriptionCount = computed.orgSubscriptions.filter((subscription) => subscription.courseId === courseId).length;
              return (
                <li key={courseId} className="flex items-start justify-between text-sm text-slate-600">
                  <div>
                    <p className="font-semibold text-slate-800">{course.name}</p>
                    <p className="text-xs text-slate-500">{course.durationDays} ימים • {course.price.toLocaleString('he-IL')} ₪</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{subscriptionCount} מנויים</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="space-y-4">
        <SectionHeader title="מנויים בארגון" description="רשימת משתמשי הקצה ושיוכי הקורסים שלהם." />
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-3 pb-3 text-right">שם</th>
                  <th className="px-3 pb-3 text-right">אימייל</th>
                  <th className="px-3 pb-3 text-right">קבוצה</th>
                  <th className="px-3 pb-3 text-left">סטטוס</th>
                  <th className="px-3 pb-3 text-right">תאריך התחלה</th>
                  <th className="px-3 pb-3 text-right">תאריך סיום</th>
                  <th className="px-3 pb-3 text-right">קורסים</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {computed.orgSubscribers.map((subscriber) => {
                  const group = organization.groups.find((g) => g.id === subscriber.groupId);
                  const subscriberCourses = computed.orgSubscriptions
                    .filter((subscription) => subscription.subscriberId === subscriber.id)
                    .map((subscription) => courses.find((course) => course.id === subscription.courseId)?.name)
                    .filter(Boolean)
                    .join(', ');
                  return (
                    <tr key={subscriber.id} className="text-slate-700">
                      <td className="px-3 py-3 text-slate-800">{subscriber.fullName}</td>
                      <td className="px-3 py-3 text-slate-600">{subscriber.email}</td>
                      <td className="px-3 py-3 text-slate-600">{group?.name ?? 'לא משויך'}</td>
                      <td className="px-3 py-3 text-left">
                        <StatusBadge label={subscriber.status} tone={getToneByStatus(subscriber.status)} />
                      </td>
                      <td className="px-3 py-3 text-slate-600">{formatDate(subscriber.startDate)}</td>
                      <td className="px-3 py-3 text-slate-600">{formatDate(subscriber.endDate)}</td>
                      <td className="px-3 py-3 text-slate-600">{subscriberCourses || '—'}</td>
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

export default OrganizationDetailsPage;
