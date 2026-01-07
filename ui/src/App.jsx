import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/SettingsPage";
import DeviceManager from "./pages/DeviceManager";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ProfilePage from "./pages/auth/ProfilePage";
import NotFound from "./pages/NotFound";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-bold text-emerald-600">
        Đang tải...
      </div>
    );

  return (
    <Routes>
      {/* Log/Reg routes*/}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />

      {/* Main routes */}
      <Route
        path="/"
        element={user ? <MainLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="devices" element={<DeviceManager />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFound />} />

      {/* Not found routes */}
      <Route
        path="*"
        element={user ? <NotFound /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
