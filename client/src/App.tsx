import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './layout/Shell';
import LandingPage from './pages/LandingPage';
import OrganizationsPage from './pages/admin/OrganizationsPage';
import OrganizationDetailsPage from './pages/admin/OrganizationDetailsPage';
import OrganizationDashboardPage from './pages/org/OrganizationDashboardPage';
import CoursesCatalogPage from './pages/catalog/CoursesCatalogPage';
import InsightsPage from './pages/reports/InsightsPage';

const App = () => {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<LandingPage />} />
        <Route path="admin/organizations" element={<OrganizationsPage />} />
        <Route path="admin/organizations/:organizationId" element={<OrganizationDetailsPage />} />
        <Route path="org/:organizationId/dashboard" element={<OrganizationDashboardPage />} />
        <Route path="catalog/courses" element={<CoursesCatalogPage />} />
        <Route path="reports/insights" element={<InsightsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
