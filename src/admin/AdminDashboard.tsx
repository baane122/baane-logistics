import React, { useState } from "react";
import { motion } from "motion/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AdminLogin } from "./AdminLogin";
import { OverviewTab } from "./tabs/OverviewTab";
import { ContainersTab } from "./tabs/ContainersTab";
import { SourcingTab } from "./tabs/SourcingTab";
import { InspectionsTab } from "./tabs/InspectionsTab";
import { QuotesTab } from "./tabs/QuotesTab";
import { UsersTab } from "./tabs/UsersTab";
import { AuditTab } from "./tabs/AuditTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { AiModelsTab } from "./tabs/AiModelsTab";
import { PromptsTab } from "./tabs/PromptsTab";
import { ApiKeysTab } from "./tabs/ApiKeysTab";
import { EmailTemplatesTab } from "./tabs/EmailTemplatesTab";

import {
  Ship, Package, ClipboardCheck, DollarSign, Users, Activity,
  AlertTriangle, LogOut, Menu, Settings, Cpu, FileText, Key, Mail, Bell, Database, Shield
} from "lucide-react";

interface AdminAppProps {
  user: { _id: string; name: string; email: string; role: string };
  onLogout: () => void;
}

type AdminTab =
  | "overview" | "containers" | "sourcing" | "inspections" | "quotes"
  | "users" | "audit" | "settings" | "ai-models" | "prompts" | "api-keys" | "email-templates";

export const AdminDashboard: React.FC<AdminAppProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const containerStats = useQuery(api.containers.getStats);
  const sourcingStats = useQuery(api.sourcing.getStats);
  const inspectionStats = useQuery(api.inspections.getStats);
  const quoteStats = useQuery(api.quotes.getStats);

  const containers = useQuery(api.containers.list, {});
  const sourcingRequests = useQuery(api.sourcing.list, {});
  const inspectionRequests = useQuery(api.inspections.list, {});
  const cargoQuotes = useQuery(api.quotes.list, {});
  const users = useQuery(api.auth.listUsers);
  const auditLogs = useQuery(api.audit.getRecent, {});
  const settings = useQuery(api.settings.getAll);
  const aiModels = useQuery(api.aiModels.list);
  const prompts = useQuery(api.prompts.list, {});
  const apiKeys = useQuery(api.apiKeys.list);
  const emailTemplates = useQuery(api.emailTemplates.list);

  const isAdmin = user.role === "admin";

  const mainTabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Activity className="h-4 w-4" /> },
    { id: "containers", label: "Containers", icon: <Ship className="h-4 w-4" /> },
    { id: "sourcing", label: "Sourcing", icon: <Package className="h-4 w-4" /> },
    { id: "inspections", label: "Inspections", icon: <ClipboardCheck className="h-4 w-4" /> },
    { id: "quotes", label: "Quotes", icon: <DollarSign className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { id: "audit", label: "Audit Log", icon: <AlertTriangle className="h-4 w-4" /> },
  ];

  const configTabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
    { id: "ai-models", label: "AI Models", icon: <Cpu className="h-4 w-4" /> },
    { id: "prompts", label: "Prompts", icon: <FileText className="h-4 w-4" /> },
    { id: "api-keys", label: "API Keys", icon: <Key className="h-4 w-4" /> },
    { id: "email-templates", label: "Emails", icon: <Mail className="h-4 w-4" /> },
  ];

  const renderTab = () => {
    const props = { user, isAdmin };
    const data = {
      containers, sourcingRequests, inspectionRequests, cargoQuotes,
      users, auditLogs, settings, aiModels, prompts, apiKeys, emailTemplates,
      containerStats, sourcingStats, inspectionStats, quoteStats,
    };
    switch (activeTab) {
      case "overview": return <OverviewTab {...props} {...data} />;
      case "containers": return <ContainersTab {...props} data={containers} />;
      case "sourcing": return <SourcingTab {...props} data={sourcingRequests} />;
      case "inspections": return <InspectionsTab {...props} data={inspectionRequests} />;
      case "quotes": return <QuotesTab {...props} data={cargoQuotes} />;
      case "users": return <UsersTab {...props} data={users} />;
      case "audit": return <AuditTab {...props} data={auditLogs} />;
      case "settings": return <SettingsTab {...props} data={settings} />;
      case "ai-models": return <AiModelsTab {...props} data={aiModels} />;
      case "prompts": return <PromptsTab {...props} data={prompts} />;
      case "api-keys": return <ApiKeysTab {...props} data={apiKeys} />;
      case "email-templates": return <EmailTemplatesTab {...props} data={emailTemplates} />;
      default: return <OverviewTab {...props} {...data} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020914] flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-navy border-r border-brand-teal/10 transform transition-transform duration-300 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-brand-teal/10 sticky top-0 bg-brand-navy z-10">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-brand-teal" />
            <span className="font-display font-extrabold text-white text-sm">Baane Control</span>
          </div>
          <p className="text-[10px] font-mono text-gray-500">{user.name} · {user.role.toUpperCase()}</p>
        </div>
        <nav className="p-3 space-y-1">
          <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider px-3 py-1 mt-1">Main</p>
          {mainTabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id ? "bg-brand-teal/10 text-brand-teal border border-brand-teal/20" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>{tab.icon}{tab.label}</button>
          ))}
          <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider px-3 py-1 mt-3">Configuration</p>
          {configTabs.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id ? "bg-brand-teal/10 text-brand-teal border border-brand-teal/20" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>{tab.icon}{tab.label}</button>
          ))}
        </nav>
        <div className="sticky bottom-0 bg-brand-navy p-4 border-t border-brand-teal/10">
          <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-xs transition-colors w-full">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-[#020914]/90 backdrop-blur-md border-b border-brand-teal/10 px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-bold text-white font-display">{activeTab.split("-").map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(" ")}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Database className="h-3.5 w-3.5 text-green-400" />
            <span className="text-[10px] font-mono text-green-400">Convex Live</span>
            <Bell className="h-4 w-4 text-gray-400" />
            <span className="text-[10px] font-mono text-gray-500">{new Date().toLocaleDateString()}</span>
          </div>
        </header>
        <div className="p-4 md:p-6">{renderTab()}</div>
      </main>
    </div>
  );
};

export default React.memo(AdminDashboard);
