import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import {
  DashboardPage,
  ThreatMapPage,
  IncidentCommandPage,
  ResourcePage,
  RouteOptimizerPage,
  AIPredictionPage,
  AnalyticsPage,
  SettingsPage,
  AICommandCenterPage,
  NotFoundPage,
} from '../pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'threat-map',
        element: <ThreatMapPage />,
      },
      {
        path: 'incidents',
        element: <IncidentCommandPage />,
      },
      {
        path: 'resources',
        element: <ResourcePage />,
      },
      {
        path: 'route-optimizer',
        element: <RouteOptimizerPage />,
      },
      {
        path: 'ai-predictions',
        element: <AIPredictionPage />,
      },
      {
        path: 'ai-command',
        element: <AICommandCenterPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
