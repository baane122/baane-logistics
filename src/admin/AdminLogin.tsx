import React, { useState } from "react";
import { motion } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Logo } from "../components/Logo";

interface AdminLoginProps {
  onLogin: (user: { _id: string; name: string; email: string; role: string }) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useMutation(api.auth.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const user = await login({ email: email.trim(), password });
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020914] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-brand-navy border border-brand-teal/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Logo className="h-14 w-auto" />
          </div>
          <h1 className="text-xl font-bold text-white text-center mb-1 font-display">Admin Control Panel</h1>
          <p className="text-gray-400 text-xs text-center mb-6 font-sans">Secure access for Baane Logistics administration</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg mb-4 font-mono"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@baane.com"
                className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#030d1a] border border-brand-teal/20 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-brand-teal"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-teal text-brand-navy hover:bg-[#00bda0] disabled:bg-gray-700 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p className="text-[10px] text-gray-500 text-center mt-6 font-mono">
            Demo: admin@baane.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(AdminLogin);
