import React, { useState, useEffect } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL || "https://tangible-husky-835.eu-west-1.convex.cloud";
const convexClient = new ConvexReactClient(CONVEX_URL);

export default function AdminApp() {
  const [user, setUser] = useState<{ _id: string; name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("baane_admin_session");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleLogin = (u: { _id: string; name: string; email: string; role: string }) => {
    setUser(u);
    localStorage.setItem("baane_admin_session", JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("baane_admin_session");
  };

  return (
    <ConvexProvider client={convexClient}>
      {user ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </ConvexProvider>
  );
}
