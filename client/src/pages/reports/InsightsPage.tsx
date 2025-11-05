import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { StatCard } from '../../components/StatCard';
import { useData } from '../../data/DataContext';

const churnRate = 4.7;
const avgCoursesPerSubscriber = 2.1;
const conversionRate = 37;

const insights = [
  {
    title: 'הזדמנויות Upsell',
    description: '12 מנויים השלימו את כל הקורסים הזמינים בארגון שלהם. אולי הגיע הזמן להציע הרחבה.',
    impact: 'פוטנציאל הכנסה של 36,000 ₪ ברבעון'
  },
  {
    title: 'מעקב אחרי מנויים מוקפאים',
    description: '5 מנויים מוקפאים מעל 30 יום בנאוויו אנליטיקס. שווה לבדוק האם מדובר בעזיבה צפויה.',
    impact: 'שימור הכנסות של 18,000 ₪'
  },
  {
    title: 'קורסים מבוקשים',
    description: 'קורס Full Stack מתקבל בציון 4.8/5 ממשתתפים. שקלו להוסיף סדנאות לייב נלוות.',
    impact: 'הגברת שביעות רצון הלקוחות'
  }
];

export const InsightsPage = () => {
  const { organizations, subscribers } = useData();

  return (
    <div className="space-y-10">
      <SectionHeader
        title="תובנות ודוחות"
        description="מבט מסכם על פעילות כלל הארגונים והצלחת התוכן הלימודי"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="שיעור נטישה חודשי"
          value={`${churnRate}%`}
          subtitle="מבוסס על מנויים שזנחו את הפלטפורמה"
        />
        <StatCard
          title="קורסים למנוי"
          value={avgCoursesPerSubscriber.toFixed(1)}
          subtitle="ממוצע across כלל הארגונים"
          accent="secondary"
        />
        <StatCard
          title="המרת תקופת ניסיון"
          value={`${conversionRate}%`}
          subtitle="מתוך ${subscribers.filter((subscriber) => subscriber.status === 'trial').length} מנויי ניסיון"
          accent="accent"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight) => (
          <Card key={insight.title} title={insight.title} footer={insight.impact}>
            <p className="text-sm text-slate-600">{insight.description}</p>
          </Card>
        ))}
      </div>

      <Card title="פריסת ארגונים">
        <div className="grid gap-4 md:grid-cols-3">
          {organizations.map((organization) => (
            <div key={organization.id} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">{organization.name}</p>
              <p className="mt-1 text-xs text-slate-500">{organization.sector}</p>
              <p className="mt-3 text-xs text-slate-500">{organization.groups.length} קבוצות</p>
              <p className="text-xs text-slate-500">{organization.courseIds.length} קורסים זמינים</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InsightsPage;
