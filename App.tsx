
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ProjectsView } from './components/views/ProjectsView';
import { BlueprintLibrary } from './components/views/BlueprintLibrary';
import { RoleManager } from './components/views/RoleManager';
import { OrgSettings } from './components/views/OrgSettings';
import { TalentPool } from './components/views/TalentPool';
import { RequestModal } from './components/RequestModal';
import { ActionCentre } from './components/ActionCentre';
import { MOCK_PROJECTS, MOCK_BLUEPRINTS, MOCK_REQUESTS, MOCK_ROLES, MOCK_USERS, MOCK_CANDIDATES, MOCK_BUDGET_TREND, MOCK_FUNNEL_DATA } from './constants';
import { CreditRequest, ViewState, RoleDefinition, UserContext } from './types';
import { ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, AreaChart, Area, ScatterChart, Scatter, FunnelChart, Funnel, LabelList } from 'recharts';

function App() {
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserContext>(MOCK_USERS[0]); // Default to Org Owner
  
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [roles, setRoles] = useState<RoleDefinition[]>(MOCK_ROLES);
  const [selectedRequest, setSelectedRequest] = useState<CreditRequest | null>(null);

  // Derived state
  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

  // Filter data based on Persona
  const visibleProjects = currentUser.role === 'ORG_OWNER' 
    ? projects 
    : projects.filter(p => p.id === currentUser.assignedProjectId);

  const visibleCandidates = currentUser.role === 'ORG_OWNER'
    ? MOCK_CANDIDATES
    : MOCK_CANDIDATES.filter(c => c.projectAffiliation === currentUser.assignedProjectId);

  const handleOpenRequest = (request: CreditRequest) => {
    setSelectedRequest(request);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
    const req = requests.find(r => r.id === id);
    if (req) {
      setProjects(prev => prev.map(p => {
        if (p.id === req.projectId) {
          return {
            ...p,
            status: 'active',
            budget: {
              ...p.budget,
              hardLimit: p.budget.hardLimit + req.amountRequested
            }
          };
        }
        return p;
      }));
    }
    handleCloseModal();
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    handleCloseModal();
  };

  const handleSaveRole = (updatedRole: RoleDefinition) => {
    const exists = roles.find(r => r.id === updatedRole.id);
    if (exists) {
        setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
    } else {
        setRoles(prev => [...prev, updatedRole]);
    }
    setActiveView('roles');
  };

  // Dashboard View Component
  const DashboardHome = () => {
    const relevantProjects = visibleProjects;
    const totalSpend = relevantProjects.reduce((acc, p) => acc + p.budget.used, 0);
    const totalCap = relevantProjects.reduce((acc, p) => acc + p.budget.hardLimit, 0);
    
    // Prepare scatter data
    const scatterData = visibleCandidates.map(c => ({
      x: c.experienceYears,
      y: c.matchScore,
      z: 1, // Bubble size
      name: c.name,
      role: c.role
    }));

    return (
        <div className="grid grid-cols-12 gap-6 h-full">
            {/* Main Content Column (Left) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                 {/* Header */}
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {currentUser.role === 'ORG_OWNER' ? 'Control Tower Overview' : 'Project Status Board'}
                    </h2>
                 </div>

                 {/* KPI Cards */}
                 <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {currentUser.role === 'ORG_OWNER' ? 'Total Org Spend' : 'Project Spend'}
                        </p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">{totalSpend.toLocaleString()}</p>
                        <p className="text-xs text-slate-400 mt-1">credits utilized</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utilization Rate</p>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold text-indigo-600 mt-2">{totalCap > 0 ? Math.round((totalSpend/totalCap)*100) : 0}%</p>
                            <p className="text-xs text-slate-400 mb-1">of budget cap</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Candidates</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">{visibleCandidates.length}</p>
                        <p className="text-xs text-slate-400 mt-1">in pipeline</p>
                    </div>
                 </div>

                 {/* Chart Row 1: Budget Trend & Pipeline */}
                 <div className="grid grid-cols-2 gap-6">
                    {/* Area Chart: Budget Trend */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-2 md:col-span-1">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Budget Velocity</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_BUDGET_TREND}>
                                    <defs>
                                        <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                    <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                    <Area type="monotone" dataKey="used" stroke="#4f46e5" fillOpacity={1} fill="url(#colorUsed)" />
                                    <Area type="monotone" dataKey="limit" stroke="#cbd5e1" strokeDasharray="4 4" fill="none" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Funnel Chart: Hiring Pipeline */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-2 md:col-span-1">
                         <h3 className="text-sm font-bold text-slate-800 mb-4">Conversion Funnel</h3>
                         <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <FunnelChart>
                                    <Tooltip />
                                    <Funnel
                                        dataKey="value"
                                        data={MOCK_FUNNEL_DATA}
                                        isAnimationActive
                                    >
                                        <LabelList position="right" fill="#000" stroke="none" dataKey="name" fontSize={10} fontWeight={600} />
                                    </Funnel>
                                </FunnelChart>
                            </ResponsiveContainer>
                         </div>
                    </div>
                 </div>

                 {/* Chart Row 2: Talent Scatter Plot */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Talent Matrix: Experience vs Match Score</h3>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Bubbles = Candidates</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="x" name="Experience" unit=" yrs" tick={{fontSize: 12}} />
                                <YAxis type="number" dataKey="y" name="Match Score" unit="%" tick={{fontSize: 12}} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Candidates" data={scatterData} fill="#8b5cf6">
                                    {scatterData.map((entry, index) => (
                                        <cell key={`cell-${index}`} fill={entry.y > 80 ? '#10b981' : entry.y < 50 ? '#ef4444' : '#8b5cf6'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
            </div>

            {/* Side Column (Right): Action Center */}
            <div className="col-span-12 lg:col-span-4 h-full min-h-[500px]">
                <ActionCentre />
            </div>
        </div>
    );
  };

  return (
    <Layout 
        activeView={activeView} 
        onNavigate={setActiveView} 
        pendingRequestsCount={pendingRequestsCount}
        currentUser={currentUser}
        onSwitchUser={setCurrentUser}
    >
      {activeView === 'dashboard' && <DashboardHome />}
      {activeView === 'projects' && <ProjectsView projects={visibleProjects} />}
      {activeView === 'blueprints' && <BlueprintLibrary blueprints={MOCK_BLUEPRINTS} />}
      {activeView === 'roles' && <RoleManager roles={roles} currentUser={currentUser} onSaveRole={handleSaveRole} />}
      {activeView === 'settings' && currentUser.role === 'ORG_OWNER' && <OrgSettings />}
      
      {activeView === 'talent' && (
        <TalentPool candidates={visibleCandidates} isGlobalView={currentUser.role === 'ORG_OWNER'} />
      )}

      <RequestModal 
        isOpen={!!selectedRequest}
        request={selectedRequest}
        project={selectedRequest ? projects.find(p => p.id === selectedRequest.projectId) : undefined}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Layout>
  );
}

export default App;
