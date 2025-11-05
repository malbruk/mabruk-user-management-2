import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'מבט על', to: '/' },
  { label: 'ניהול ארגונים', to: '/admin/organizations' },
  { label: 'מבט ארגון', to: '/org/1/dashboard' },
  { label: 'קורסים', to: '/catalog/courses' },
  { label: 'תובנות', to: '/reports/insights' }
];

const isActive = (current: string, target: string) => {
  if (target === '/') {
    return current === '/';
  }
  return current.startsWith(target);
};

export const Shell = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-semibold">
              MU
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">ממשק ניהול</p>
              <h1 className="text-xl font-semibold text-slate-800">Mabruk Learning Platform</h1>
            </div>
          </div>
          <nav className="flex gap-2 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: navIsActive }) =>
                  `rounded-full px-4 py-2 transition ${
                    navIsActive || isActive(location.pathname, item.to)
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Shell;
