
import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../../types';
import { AlertCircle, CheckCircle, ShieldAlert, Settings, MoreHorizontal, Filter, ArrowUpRight, Save, DollarSign, PlayCircle, PauseCircle, Activity } from 'lucide-react';
import { MOCK_USERS } from '../../constants';
import { ContextualInsight } from '../ui/ContextualInsight';
import { useToast } from '../../components/ui/Toast';

interface ProjectsViewProps {
  projects: Project[];
  onManageAccess: () => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
}

const BudgetProgressBar: React.FC<{ used: number; soft: number; hard: number; }> = ({ used, soft, hard }) => {
  const percentage = Math.min((used / hard) * 100, 100);
  const softMarker = (soft / hard) * 100;

  let colorClass = 'bg-emerald-500';
  if (used >= hard) colorClass = 'bg-red-600';
  else if (used >= soft) colorClass = 'bg-amber-500';

  return (
    <div className="relative pt-6 group">
      <div className="flex justify-between text-xs mb-1 font-medium text-slate-500">
        <span>0</span>
        <span style={{ left: `${softMarker}%` }} className="absolute -top-1 transform -translate-x-1/2 text-amber-600 flex flex-col items-center">
            <span className="w-0.5 h-1 bg-amber-600 mb-0.5"></span>
            Soft ({soft})
        </span>
        <span className="text-red-600">Hard Cap ({hard})</span>
      </div>
      <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden relative">
        {/* Soft Limit Marker Line */}
        <div 
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10 border-l border-dashed border-slate-500 opacity-50" 
            style={{ left: `${softMarker}%` }} 
        />
        {/* Progress */}
        <div 
          className={`h-full ${colorClass} transition-all duration-500 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between items-center">
        <span className={`text-sm font-bold ${used > soft ? 'text-amber-700' : 'text-slate-700'}`}>
          {used} Used
        </span>
        <div className="flex items-center gap-2">
            {used >= hard && <span className="text-xs font-bold text-red-600 flex items-center gap-1"><ShieldAlert size={12}/> BLOCKED</span>}
        </div>
      </div>
    </div>
  );
};

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onManageAccess, onUpdateProject }) => {
  const govUsers = MOCK_USERS.filter(u => u.role === 'ORG_OWNER' || u.role === 'PROJECT_OWNER').slice(0,3);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Risk'>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showInsight, setShowInsight] = useState(true);

  const { addToast } = useToast();

  // Mock edit state for budget controls
  const [tempBudget, setTempBudget] = useState<{soft: number, hard: number}>({soft: 0, hard: 0});
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setActiveMenuId(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startEdit = (p: Project) => {
      setTempBudget({ soft: p.budget.softLimit, hard: p.budget.hardLimit });
      setEditingId(p.id);
      setActiveMenuId(null);
  }

  const saveBudget = (projectId: string) => {
      onUpdateProject(projectId, { 
          budget: { 
              ...projects.find(p => p.id === projectId)!.budget, 
              softLimit: tempBudget.soft, 
              hardLimit: tempBudget.hard 
          } 
      });
      setEditingId(null);
  };

  const displayedProjects = projects.filter(p => {
      if (filter === 'Active') return p.status === 'active';
      if (filter === 'Risk') return p.status === 'blocked' || p.status === 'warning';
      return true;
  });

  return (
    <div className="space-y-6">
      
      {showInsight && (
        <ContextualInsight 
          type="risk"
          title="Budget Velocity Alert"
          description="Based on interview scheduling velocity, 'Project Phoenix' is projected to hit its Hard Cap in 12 days. This is 30% faster than typical burn rates."
          metric="12 Days"
          metricLabel="Time to Cap"
          actionLabel="Review Usage"
          onAction={() => addToast('Insight Actioned', 'Redirecting to detailed usage analytics...', 'info')}
          onDismiss={() => setShowInsight(false)}
        />
      )}

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Requisition Authority</h2>
          <p className="text-slate-500">Manage budget caps and project execution status.</p>
        </div>
        
        <div className="flex items-center gap-4">
             {/* Contextual Access Control */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 pr-4 rounded-xl shadow-sm">
                <div className="flex items-center -space-x-2 pl-2">
                    {govUsers.map((u, i) => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 relative" title={u.name}>
                            {u.avatar}
                            </div>
                    ))}
                    <button 
                        onClick={onManageAccess}
                        className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors z-10"
                    >
                        <Settings size={14} />
                    </button>
                </div>
                <div className="text-left border-l border-slate-200 pl-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Governance</p>
                        <p className="text-xs font-bold text-slate-900">Project Admins</p>
                </div>
            </div>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors h-12">
            + New Project Scope
            </button>
        </div>
      </div>

      {/* Controls Toolbar */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
             {(['All', 'Active', 'Risk'] as const).map(f => (
                 <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${filter === f ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                 >
                     {f}
                 </button>
             ))}
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
              <Filter size={12} /> {displayedProjects.length} Projects Visible
          </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col group hover:shadow-md transition-all relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                <p className="text-sm text-slate-500">{project.costCenter}</p>
              </div>
              <div className="flex gap-2 relative">
                 <div className={`p-1.5 rounded-full ${project.status === 'active' ? 'bg-emerald-100 text-emerald-600' : project.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    {project.status === 'active' && <CheckCircle size={18} />}
                    {project.status === 'blocked' && <ShieldAlert size={18} />}
                    {project.status === 'warning' && <AlertCircle size={18} />}
                 </div>
                 
                 <button 
                    onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === project.id ? null : project.id); }}
                    className={`text-slate-300 hover:text-indigo-600 transition-colors p-1 rounded-md ${activeMenuId === project.id ? 'bg-slate-100 text-indigo-600' : ''}`}
                 >
                     <MoreHorizontal size={18} />
                 </button>

                 {/* Dropdown Menu */}
                 {activeMenuId === project.id && (
                    <div ref={menuRef} className="absolute right-0 top-8 w-48 bg-white border border-slate-200 shadow-xl rounded-lg z-20 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="px-3 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Project Controls
                        </div>
                        <button 
                            onClick={() => startEdit(project)} 
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium flex items-center gap-2"
                        >
                            <DollarSign size={14} /> Edit Budget Caps
                        </button>
                        <button 
                            onClick={() => {
                                onUpdateProject(project.id, { status: project.status === 'active' ? 'blocked' : 'active' });
                                setActiveMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium flex items-center gap-2"
                        >
                            {project.status === 'active' ? (
                                <>
                                    <PauseCircle size={14} className="text-amber-500" /> Pause Project
                                </>
                            ) : (
                                <>
                                    <PlayCircle size={14} className="text-emerald-500" /> Resume Project
                                </>
                            )}
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 font-medium flex items-center gap-2">
                            <Activity size={14} /> View Audit Log
                        </button>
                    </div>
                 )}
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {project.owner.charAt(0)}
                </div>
                <span className="text-sm text-slate-900">{project.owner}</span>
              </div>
              <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                  View Detail <ArrowUpRight size={12} />
              </button>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-4">
              {editingId === project.id ? (
                  <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-indigo-100 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-900 mb-1">
                          <span>Adjusting Caps</span>
                          <span className="text-indigo-400 uppercase text-[10px]">Credits</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Soft Limit</label>
                            <input 
                                type="number" 
                                value={tempBudget.soft} 
                                onChange={(e) => setTempBudget({...tempBudget, soft: parseInt(e.target.value)})}
                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 font-bold text-slate-900 bg-white" 
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Hard Limit</label>
                            <input 
                                type="number" 
                                value={tempBudget.hard} 
                                onChange={(e) => setTempBudget({...tempBudget, hard: parseInt(e.target.value)})}
                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded outline-none focus:border-indigo-500 font-bold text-slate-900 bg-white" 
                            />
                          </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                          <button onClick={() => setEditingId(null)} className="flex-1 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded transition-colors">Cancel</button>
                          <button onClick={() => saveBudget(project.id)} className="flex-1 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center gap-1 transition-colors">
                              <Save size={12} /> Save
                          </button>
                      </div>
                  </div>
              ) : (
                  <BudgetProgressBar 
                    used={project.budget.used} 
                    soft={project.budget.softLimit} 
                    hard={project.budget.hardLimit} 
                  />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
