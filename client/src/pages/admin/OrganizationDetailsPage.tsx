import { FormEvent, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useData } from '../../data/DataContext';
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
  const { organizations, courses, subscribers, subscriptions, addGroup } = useData();
  const organization = organizations.find((org) => org.id === organizationId);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    managerName: '',
    managerEmail: ''
  });
  const [groupFeedback, setGroupFeedback] = useState<string | null>(null);

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
  }, [organizationId, subscribers, subscriptions]);

  const resetGroupForm = () => {
    setGroupForm({ name: '', description: '', managerName: '', managerEmail: '' });
  };

  const handleAddGroup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!organization) {
      return;
    }
    if (!groupForm.name.trim()) {
      return;
    }

    addGroup(organization.id, groupForm);
    setGroupFeedback(`הקבוצה "${groupForm.name}" נוספה בהצלחה`);
    resetGroupForm();
    setIsAddingGroup(false);
  };

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
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-600">
              <span>ניהול קבוצות וקהלים בארגון</span>
              <button
                onClick={() => {
                  setGroupFeedback(null);
                  setIsAddingGroup((prev) => !prev);
                }}
                className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
              >
                {isAddingGroup ? 'סגירת טופס' : 'קבוצה חדשה'}
              </button>
            </div>
            {groupFeedback ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">{groupFeedback}</div>
            ) : null}
            {isAddingGroup ? (
              <form onSubmit={handleAddGroup} className="grid gap-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                    שם הקבוצה
                    <input
                      required
                      value={groupForm.name}
                      onChange={(event) => setGroupForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="לדוגמה: צוות מוצר"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                    תיאור (לא חובה)
                    <input
                      value={groupForm.description}
                      onChange={(event) => setGroupForm((prev) => ({ ...prev, description: event.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="מה מטרת הקבוצה"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                    מנהל/ת קבוצה (לא חובה)
                    <input
                      value={groupForm.managerName}
                      onChange={(event) => setGroupForm((prev) => ({ ...prev, managerName: event.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="לדוגמה: עדן לוי"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                    אימייל מנהל/ת (לא חובה)
                    <input
                      type="email"
                      value={groupForm.managerEmail}
                      onChange={(event) => setGroupForm((prev) => ({ ...prev, managerEmail: event.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="eden@example.com"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetGroupForm();
                      setIsAddingGroup(false);
                    }}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
                  >
                    שמירת קבוצה
                  </button>
                </div>
              </form>
            ) : null}
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
          </div>
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
