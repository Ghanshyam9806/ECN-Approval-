import React from 'react';
import { UserProfile, UserRole } from '../types';
import { FileSpreadsheet, ShieldCheck, Mail, PlusCircle, History, UserCheck, Search, HardDrive, KeyRound } from 'lucide-react';

interface HeaderProps {
  activeUser: UserProfile;
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenEmailLoginModal: () => void;
  onOpenNewEcnModal: () => void;
  onOpenOutboxModal: () => void;
  onOpenAuditLogModal: () => void;
  onOpenRbacModal: () => void;
  onOpenDriveSyncModal: () => void;
  outboxCount: number;
  onSearchEcnId: (ecnId: string) => void;
  activeTab: 'dashboard' | 'audit' | 'rbac';
  setActiveTab: (tab: 'dashboard' | 'audit' | 'rbac') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeUser,
  users,
  onSelectUser,
  onOpenEmailLoginModal,
  onOpenNewEcnModal,
  onOpenOutboxModal,
  onOpenAuditLogModal,
  onOpenRbacModal,
  onOpenDriveSyncModal,
  outboxCount,
  onSearchEcnId,
  activeTab,
  setActiveTab,
}) => {
  const [quickSearch, setQuickSearch] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onSearchEcnId(quickSearch.trim());
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Requester':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Department Approver':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'ECN Coordinator':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Auditor':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-30">
      {/* Top Banner: Dixon / Padget Paperless ECN Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & App Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-md text-white">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Paperless ECN Approval System</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full">
                  Bento DB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Engineering Change Notice • Google Drive DB Sync • Multi-Dept Approval
              </p>
            </div>
          </div>

          {/* Direct ECN Quick Link Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Paste ECN ID or Link..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-medium rounded-lg transition"
            >
              Open
            </button>
          </form>

          {/* Action Buttons & Navigation */}
          <div className="flex items-center space-x-2 flex-wrap">
            <button
              onClick={onOpenNewEcnModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New ECN</span>
            </button>

            <button
              onClick={onOpenOutboxModal}
              className="relative flex items-center space-x-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition"
              title="View Sent Email Notifications & ECN Direct Links"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Outbox</span>
              {outboxCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full">
                  {outboxCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-1 px-3 py-2 text-xs font-medium rounded-xl border transition ${
                activeTab === 'audit'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <History className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Audit Trail</span>
            </button>

            <button
              onClick={() => setActiveTab('rbac')}
              className={`flex items-center space-x-1 px-3 py-2 text-xs font-medium rounded-xl border transition ${
                activeTab === 'rbac'
                  ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">RBAC Security</span>
            </button>

            <button
              onClick={onOpenDriveSyncModal}
              className="flex items-center space-x-1 px-3 py-2 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 text-xs font-medium rounded-xl border border-indigo-700/60 transition shadow-sm"
              title="Google Drive DB Synchronization & Backup"
            >
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Drive DB</span>
            </button>
          </div>
        </div>

        {/* User Persona Switcher Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-slate-300 flex-wrap gap-y-1">
            <span className="font-medium text-slate-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Current Role Persona:
            </span>
            <select
              value={activeUser.id}
              onChange={(e) => {
                const found = users.find(u => u.id === e.target.value);
                if (found) onSelectUser(found);
              }}
              className="bg-slate-800 text-white font-medium text-xs rounded-md border border-slate-700 px-2.5 py-1 focus:ring-2 focus:ring-blue-500 outline-none max-w-xs"
            >
              {users.map((usr) => (
                <option key={usr.id} value={usr.id}>
                  {usr.name} — {usr.department} ({usr.role})
                </option>
              ))}
            </select>

            <button
              onClick={onOpenEmailLoginModal}
              className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg border border-indigo-400/40 transition shadow-sm"
              title="Login with work email address"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Email Login</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${getRoleBadgeColor(activeUser.role)}`}>
              {activeUser.role}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {activeUser.email}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {activeUser.department}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};

