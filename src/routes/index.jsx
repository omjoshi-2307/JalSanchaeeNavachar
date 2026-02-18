import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Dashboard from '../pages/Dashboard/Dashboard';
import Planner from '../pages/IrrigationPlanner/Planner';
import Profile from '../pages/Profile/Profile';
import PlaceholderPage from '../pages/PlaceholderPage';
import {
  History,
  Settings,
  HelpCircle,
  Zap,
  Sprout,
  Bell,
  User
} from 'lucide-react';

export const routes = [
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/irrigation',
    element: (
      <ProtectedRoute>
        <Planner />
      </ProtectedRoute>
    )
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <PlaceholderPage
          title="Activity History"
          icon={History}
          description="Review your past irrigation schedules and farm performance data."
        />
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <PlaceholderPage
          title="Account Settings"
          icon={Settings}
          description="Manage your profile, farm locations, and notification preferences."
        />
      </ProtectedRoute>
    )
  },
  {
    path: '/support',
    element: (
      <ProtectedRoute>
        <PlaceholderPage
          title="Help & Support"
          icon={HelpCircle}
          description="Get expert advice on irrigation best practices and system troubleshooting."
        />
      </ProtectedRoute>
    )
  },
  {
    path: '/automation',
    element: (
      <ProtectedRoute>
        <PlaceholderPage
          title="Smart Automation"
          icon={Zap}
          description="Configure automated watering triggers and smart pump integration."
        />
      </ProtectedRoute>
    )
  },
  {
    path: '/analysis',
    element: (
      <ProtectedRoute>
        <PlaceholderPage
          title="Crop Analysis"
          icon={Sprout}
          description="Deep insights into crop health through satellite imagery and soil sensors."
        />
      </ProtectedRoute>
    )
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <PlaceholderPage
          title="Notifications"
          icon={Bell}
          description="View all your alerts and updates in one place."
        />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> }
];
