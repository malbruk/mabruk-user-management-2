import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../data/DataContext';
import { formatDate } from '../../utils/date';
import { SectionHeader } from '../../components/SectionHeader';
import { StatCard } from '../../components/StatCard';
import { Card } from '../../components/Card';
import type { Subscriber } from '../../data/mockData';

const summarizeOrganization = (organizationId: number, allSubscribers: Subscriber[]) => {
  const orgSubscribers = allSubscribers.filter((subscriber) => subscriber.organizationId === organizationId);
  const active = orgSubscribers.filter((subscriber) => subscriber.status === 'active');
  return {
    totalSubscribers: orgSubscribers.length,
    activeCount: active.length
  };
};

export const OrganizationsPage = () => {
  const { organizations, subscribers, courses, addOrganization } = useData();
  const totalCourses = organizations.reduce((sum, org) => sum + org.courseIds.length, 0);
  const [isAddingOrganization, setIsAddingOrganization] = useState(false);
  const [organizationForm, setOrganizationForm] = useState({
    name: '',
    sector: '',
    city: ''
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const resetForm = () => {
    setOrganizationForm({ name: '', sector: '', city: '' });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!organizationForm.name.trim() || !organizationForm.sector.trim() || !organizationForm.city.trim()) {
      return;
    }

    addOrganization(organizationForm);
    setFeedback(`הארגון "${organizationForm.name}" נוסף בהצלחה`);
    resetForm();
    setIsAddingOrganization(false);
  };

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
          title="סך הכל מנויים"
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
            <button
              onClick={() => {
                setFeedback(null);
                setIsAddingOrganization((prev) => !prev);
              }}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              {isAddingOrganization ? 'סגירת טופס' : 'ארגון חדש'}
            </button>
          }
        />
        {feedback ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {feedback}
          </div>
        ) : null}
        {isAddingOrganization ? (
          <Card title="הוספת ארגון חדש">
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                שם הארגון
                <input
                  required
                  value={organizationForm.name}
                  onChange={(event) => setOrganizationForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="לדוגמה: גלובל טק"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                תחום פעילות
                <input
                  required
                  value={organizationForm.sector}
                  onChange={(event) => setOrganizationForm((prev) => ({ ...prev, sector: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="לדוגמה: שירותים מקצועיים"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                עיר
                <input
                  required
                  value={organizationForm.city}
                  onChange={(event) => setOrganizationForm((prev) => ({ ...prev, city: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="לדוגמה: תל אביב"
                />
              </label>
              <div className="flex justify-end gap-2 md:col-span-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsAddingOrganization(false);
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  שמירת ארגון
                </button>
              </div>
            </form>
          </Card>
        ) : null}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-3 pb-3 text-right">שם</th>
                  <th className="px-3 pb-3 text-right">נוצר בתאריך</th>
                  <th className="px-3 pb-3 text-right">קבוצות</th>
                  <th className="px-3 pb-3 text-right">קורסים זמינים</th>
                  <th className="px-3 pb-3 text-right">מנויים פעילים</th>
                  <th className="px-3 pb-3 text-right">סה"כ מנויים</th>
                  <th className="px-3 pb-3 text-left">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {organizations.map((organization) => {
                  const summary = summarizeOrganization(organization.id, subscribers);
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
                      <td className="px-3 py-3 text-left">
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
