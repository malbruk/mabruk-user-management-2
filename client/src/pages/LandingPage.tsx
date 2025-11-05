import { Link } from 'react-router-dom';
import { useData } from '../data/DataContext';

const quickLinks = [
  {
    title: 'ניהול ארגונים',
    description: 'הוספה ועדכון של ארגונים, מנהלי מערכת וקבוצות פנים-ארגוניות.',
    to: '/admin/organizations'
  },
  {
    title: 'לוח הבקרה של ארגון',
    description: 'מבט מפורט על מנויים, קורסים ושיוכים עבור ארגון ספציפי.',
    to: '/org/1/dashboard'
  },
  {
    title: 'ספריית הקורסים',
    description: 'תיעוד הקורסים הפעילים וכלי עזר לתקשורת עם מנהלי ארגונים.',
    to: '/catalog/courses'
  }
];

export const LandingPage = () => {
  const { organizations, subscribers, courses } = useData();

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-10 py-12 text-white shadow-lg">
        <h2 className="text-3xl font-semibold">ברוכים הבאים למערכת ניהול המשתמשים</h2>
        <p className="mt-4 max-w-2xl text-lg text-white/90">
          זהו אב-טיפוס אינטראקטיבי שמדגים את הזרימות המרכזיות עבור מנהל-על ומנהלי ארגונים. כל הנתונים מוצגים לצורך
          הדגמה בלבד.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-6">
            <p className="text-sm uppercase tracking-widest text-white/70">ארגונים פעילים</p>
            <p className="mt-2 text-3xl font-semibold">{organizations.length}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-6">
            <p className="text-sm uppercase tracking-widest text-white/70">מנויים</p>
            <p className="mt-2 text-3xl font-semibold">{subscribers.length}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-6">
            <p className="text-sm uppercase tracking-widest text-white/70">קורסים זמינים</p>
            <p className="mt-2 text-3xl font-semibold">{courses.length}</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-slate-800">פעולות מהירות</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/70 hover:shadow-lg"
            >
              <h4 className="text-lg font-semibold text-slate-800 group-hover:text-primary">{link.title}</h4>
              <p className="mt-2 text-sm text-slate-600">{link.description}</p>
              <span className="mt-auto pt-4 text-sm font-medium text-primary group-hover:underline">פתח מסך</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
