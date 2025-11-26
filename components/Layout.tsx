
import React, { useState } from 'react';
import { LayoutDashboard, Building2, Users, Settings, Bell, Search, ShieldCheck, KeyRound, Wallet, Globe, Briefcase, FileText, ChevronDown, Layers } from 'lucide-react';
import { UserContext } from '../types';
import { MOCK_USERS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: any) => void;
  pendingRequestsCount: number;
  currentUser: UserContext;
  onSwitchUser: (user: UserContext) => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium transition-all rounded-lg mb-1 ${
      active
        ? 'bg-slate-900 text-white shadow-md'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={18} className={active ? 'text-white' : 'text-slate-500'} />
      <span>{label}</span>
    </div>
    {badge > 0 && (
      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
        {badge}
      </span>
    )}
  </button>
);

const SidebarSection = ({ title }: { title: string }) => (
    <div className="px-3 mt-6 mb-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
    </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, pendingRequestsCount, currentUser, onSwitchUser }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-50/50 border-r border-slate-200 flex flex-col z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <ShieldCheck size={20} />
            </div>
            <span>Control Tower</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <SidebarSection title="Main" />
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => onNavigate('dashboard')} 
          />
          
          {currentUser.role === 'ORG_OWNER' && (
            <SidebarItem 
            icon={Building2} 
            label="Projects & Budgets" 
            active={activeView === 'projects'} 
            onClick={() => onNavigate('projects')} 
            badge={pendingRequestsCount}
            />
          )}

          <SidebarSection title="Assets" />
          <SidebarItem 
            icon={Users} 
            label="Talent Pool"
            active={activeView === 'talent'} 
            onClick={() => onNavigate('talent')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Templates" 
            active={activeView === 'blueprints'} 
            onClick={() => onNavigate('blueprints')} 
          />

          <SidebarSection title="Governance" />
          <SidebarItem 
            icon={KeyRound} 
            label="Roles & Access" 
            active={activeView === 'roles'} 
            onClick={() => onNavigate('roles')} 
          />
          
          {currentUser.role === 'ORG_OWNER' && (
            <SidebarItem 
            icon={Wallet} 
            label="Settings & Billing" 
            active={activeView === 'settings'} 
            onClick={() => onNavigate('settings')} 
            />
          )}
        </nav>

        {/* User Switcher */}
        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${currentUser.role === 'ORG_OWNER' ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' : 'bg-gradient-to-br from-emerald-500 to-emerald-700'}`}>
              {currentUser.avatar}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                {currentUser.role === 'ORG_OWNER' ? 'Super Admin' : 'Project Owner'}
              </p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
                <div className="p-3 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Switch Persona</p>
                </div>
                {MOCK_USERS.map(u => (
                    <button
                        key={u.id}
                        onClick={() => {
                            onSwitchUser(u);
                            setShowUserMenu(false);
                            onNavigate('dashboard');
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-center gap-3 ${currentUser.id === u.id ? 'bg-indigo-50/50 text-indigo-700' : 'text-slate-700'}`}
                    >
                        <div className={`w-2 h-2 rounded-full ${u.role === 'ORG_OWNER' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                        {u.name}
                    </button>
                ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
             {/* Breadcrumbs or Title could go here */}
             <div className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <Globe size={14} />
                <span>Control Tower</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 capitalize">{activeView}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Search assets..." 
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-slate-700 placeholder-slate-400"
                />
             </div>
             
             {currentUser.role === 'ORG_OWNER' && (
                <button className="relative text-slate-400 hover:text-slate-900 transition-colors">
                    <Bell size={20} />
                    {pendingRequestsCount > 0 && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    )}
                </button>
             )}
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-50 p-8">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};
