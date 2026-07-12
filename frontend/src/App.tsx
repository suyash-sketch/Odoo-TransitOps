import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { useAuthStore } from "./stores/authStore";

function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/fleet" element={<PlaceholderPage title="Fleet" />} />
          <Route path="/drivers" element={<PlaceholderPage title="Drivers" />} />
          <Route path="/trips" element={<PlaceholderPage title="Trips" />} />
          <Route path="/maintenance" element={<PlaceholderPage title="Maintenance" />} />
          <Route path="/fuel-expenses" element={<PlaceholderPage title="Fuel & Expenses" />} />
          <Route path="/analytics" element={<PlaceholderPage title="Analytics" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Route>
    </Routes>
  );
}

/** Placeholder for unimplemented pages */
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center animate-fade-in">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">{title}</h1>
        <p className="text-text-secondary text-sm">This page is under construction.</p>
      </div>
    </div>
  );
}

export default App;
