import React from 'react';
import { Project } from '../../types';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
}

const BudgetProgressBar: React.FC<{ used: number; soft: number; hard: number }> = ({ used, soft, hard }) => {
  const percentage = Math.min((used / hard) * 100, 100);
  const softMarker = (soft / hard) * 100;

  let colorClass = 'bg-emerald-500';
  if (used >= hard) colorClass = 'bg-red-600';
  else if (used >= soft) colorClass = 'bg-amber-500';

  return (
    <div className="relative pt-6">
      <div className="flex justify-between text-xs mb-1 font-medium text-slate-500">
        <span>0</span>
        <span style={{ left: `${softMarker}%` }} className="absolute -top-1 transform -translate-x-1/2 text-amber-600">
          Soft Cap ({soft})
        </span>
        <span className="text-red-600">Hard Cap ({hard})</span>
      </div>
      <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden relative">
        {/* Soft Limit Marker Line */}
        <div 
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10 border-l border-dashed border-slate-500" 
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
        {used >= hard && <span className="text-xs font-bold text-red-600 flex items-center gap-1"><ShieldAlert size={12}/> BLOCKED</span>}
      </div>
    </div>
  );
};

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Requisition Authority</h2>
          <p className="text-slate-500">Manage budget caps and project execution status.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
          + New Project Scope
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                <p className="text-sm text-slate-500">{project.costCenter}</p>
              </div>
              <div className={`p-1.5 rounded-full ${project.status === 'active' ? 'bg-emerald-100 text-emerald-600' : project.status === 'blocked' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                {project.status === 'active' && <CheckCircle size={18} />}
                {project.status === 'blocked' && <ShieldAlert size={18} />}
                {project.status === 'warning' && <AlertCircle size={18} />}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-slate-600 mb-1">Owner</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  {project.owner.charAt(0)}
                </div>
                <span className="text-sm text-slate-900">{project.owner}</span>
              </div>
            </div>

            <div className="mt-auto border-t border-slate-100 pt-4">
              <BudgetProgressBar 
                used={project.budget.used} 
                soft={project.budget.softLimit} 
                hard={project.budget.hardLimit} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};