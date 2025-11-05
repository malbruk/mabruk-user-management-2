import { FormEvent, useState } from 'react';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { useData } from '../../data/DataContext';

export const CoursesCatalogPage = () => {
  const { courses, organizations, addCourse } = useData();
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({
    name: '',
    price: '',
    durationDays: '',
    description: ''
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const resetForm = () => {
    setCourseForm({ name: '', price: '', durationDays: '', description: '' });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const priceValue = Number(courseForm.price);
    const durationValue = Number(courseForm.durationDays);
    if (!courseForm.name.trim() || !courseForm.description.trim()) {
      return;
    }
    if (Number.isNaN(priceValue) || Number.isNaN(durationValue) || priceValue <= 0 || durationValue <= 0) {
      return;
    }

    addCourse({
      name: courseForm.name,
      price: priceValue,
      durationDays: durationValue,
      description: courseForm.description
    });
    setFeedback(`הקורס "${courseForm.name}" נוסף למאגר`);
    resetForm();
    setIsAddingCourse(false);
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        title="ספריית הקורסים"
        description="רשימת הקורסים הפעילים והארגונים שבחרו בהם."
        actions={
          <button
            onClick={() => {
              setFeedback(null);
              setIsAddingCourse((prev) => !prev);
            }}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            {isAddingCourse ? 'סגירת טופס' : 'הוספת קורס'}
          </button>
        }
      />

      {feedback ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{feedback}</div>
      ) : null}

      {isAddingCourse ? (
        <Card title="קורס חדש בספרייה">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              שם הקורס
              <input
                required
                value={courseForm.name}
                onChange={(event) => setCourseForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="לדוגמה: עקרונות ניהול מוצר"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              מחיר (₪)
              <input
                required
                type="number"
                min={1}
                value={courseForm.price}
                onChange={(event) => setCourseForm((prev) => ({ ...prev, price: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="לדוגמה: 3200"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              משך (ימים)
              <input
                required
                type="number"
                min={1}
                value={courseForm.durationDays}
                onChange={(event) => setCourseForm((prev) => ({ ...prev, durationDays: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="לדוגמה: 45"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 md:col-span-2">
              תיאור קצר
              <textarea
                required
                value={courseForm.description}
                onChange={(event) => setCourseForm((prev) => ({ ...prev, description: event.target.value }))}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="כמה מילים על הקורס"
                rows={3}
              />
            </label>
            <div className="flex justify-end gap-2 md:col-span-2">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsAddingCourse(false);
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                ביטול
              </button>
              <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
              >
                שמירת קורס
              </button>
            </div>
          </form>
        </Card>
      ) : null}

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
