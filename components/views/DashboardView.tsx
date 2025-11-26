import React from 'react';
import { UserContext, Project, Candidate } from '../../types';
import { ActionCentre } from '../ActionCentre';
import { Briefcase, Users, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { MOCK_FUNNEL_DATA, MOCK_BUDGET_TREND } from '../../constants';

interface DashboardViewProps {
  currentUser: UserContext;
  projects: Project[];
  candidates: Candidate[];
  onActionClick: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ currentUser, projects, candidates, onActionClick }) => {
  const atRiskProjects = projects.filter(p => p.status === 'blocked' || p.status === 'warning');
  const totalBudgetUsed = projects.reduce((acc, p) => acc + p.budget.used, 0);
  const totalBudgetLimit = projects.reduce((acc, p) => acc + p.budget.hardLimit, 0);
  const utilization = Math.round((totalBudgetUsed / totalBudgetLimit) * 100) || 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left Column: Metrics & Charts */}
      <div className="xl:col-span-2 space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name.split(' ')[0]}</h1>
                <p className="text-indigo-200 text-lg max-w-xl">
                    {currentUser.role === 'ORG_OWNER' 
                    ? "System integrity is optimal. You have 3 pending approvals requiring governance review."
                    : "Project Phoenix is approaching budget cap. Review candidates for the Q4 sprint."}
                </p>
                <div className="mt-8 flex gap-4">
                    <button className="px-6 py-2 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg">
                        View Alerts
                    </button>
                    <button className="px-6 py-2 bg-indigo-800 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors border border-indigo-700">
                        Generate Report
                    </button>
                </div>
            </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <Briefcase size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Active Projects</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900">{projects.length}</span>
                    <span className="text-xs font-bold text-emerald-600 mb-1.5 flex items-center">
                        <TrendingUp size={12} className="mr-0.5" /> +2
                    </span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Users size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Candidates</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900">{candidates.length}</span>
                    <span className="text-xs font-bold text-indigo-600 mb-1.5 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Global Pool
                    </span>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${utilization > 80 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <AlertCircle size={20} />
                    </div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Budget Utilization</span>
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-slate-900">{utilization}%</span>
                    <span className="text-xs text-slate-400 mb-1.5">of allocated cap</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${utilization > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                        style={{width: `${utilization}%`}}
                    />
                </div>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Budget Velocity</h3>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                        Full Report <ArrowUpRight size={12} />
                    </button>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_BUDGET_TREND}>
                            <defs>
                                <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="used" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsed)" />
                            <Area type="monotone" dataKey="limit" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900">Talent Pipeline</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Last 30 Days</span>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_FUNNEL_DATA} layout="vertical" barSize={20}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {MOCK_FUNNEL_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* At Risk Projects */}
        {atRiskProjects.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/30">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="text-red-600" size={20} />
                        <h3 className="font-bold text-slate-900">Projects Requiring Attention</h3>
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {atRiskProjects.map(p => (
                        <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                                <p className="text-xs text-slate-500">{p.owner} • {p.costCenter}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs font-bold uppercase text-slate-400">Budget</p>
                                    <p className={`text-sm font-bold ${p.budget.used >= p.budget.hardLimit ? 'text-red-600' : 'text-amber-600'}`}>
                                        {p.budget.used} / {p.budget.hardLimit}
                                    </p>
                                </div>
                                <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                    Manage
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Right Column: Action Center */}
      <div className="xl:col-span-1 h-[calc(100vh-8rem)] sticky top-32">
        <ActionCentre onActionClick={onActionClick} />
      </div>
    </div>
  );
};