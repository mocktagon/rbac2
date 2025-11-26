
import React, { useState } from 'react';
import { MOCK_INTEGRATIONS, MOCK_USERS } from '../../constants';
import { CheckCircle2, Cloud, Plus, ArrowRight, Plug, Settings } from 'lucide-react';

interface IntegrationsViewProps {
    onManageAccess: () => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ onManageAccess }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const adminUsers = MOCK_USERS.filter(u => u.role === 'ORG_OWNER');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Integrations</h2>
          <p className="text-slate-500">Connect Control Tower with your HR, Comms, and Calendar ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-4">
            {/* Contextual Access Control */}
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 pr-4 rounded-xl shadow-sm">
                <div className="flex items-center -space-x-2 pl-2">
                    {adminUsers.map((u, i) => (
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
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Connection</p>
                        <p className="text-xs font-bold text-slate-900">IT Admins</p>
                </div>
            </div>

            <button 
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 h-12"
            >
            <Plus size={18} /> Request Integration
            </button>
        </div>
      </div>

      {showRequestForm && (
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg animate-in slide-in-from-top-4 duration-300">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Cloud size={20} className="text-indigo-400" /> Request New Connector
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tool Name</label>
                    <input type="text" placeholder="e.g. SAP SuccessFactors" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors">
                        <option>ATS</option>
                        <option>HRIS</option>
                        <option>Communication</option>
                        <option>Identity / SSO</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-3">
                <button onClick={() => setShowRequestForm(false)} className="text-slate-400 hover:text-white text-sm font-medium">Cancel</button>
                <button onClick={() => setShowRequestForm(false)} className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-bold">Submit Request</button>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_INTEGRATIONS.map(integration => (
          <div key={integration.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group">
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                   <img src={integration.icon} alt={integration.name} className="w-8 h-8 opacity-90" />
               </div>
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                   integration.status === 'Connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
               }`}>
                   {integration.status}
               </span>
            </div>

            <h3 className="font-bold text-slate-900 text-lg mb-1">{integration.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{integration.category}</p>
            <p className="text-slate-600 text-sm mb-6 flex-1">{integration.description}</p>

            <div className="pt-4 border-t border-slate-100 mt-auto">
                {integration.status === 'Connected' ? (
                    <button className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-sm flex items-center justify-center gap-2 cursor-default">
                        <CheckCircle2 size={16} /> Active
                    </button>
                ) : (
                    <button className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                        <Plug size={16} /> Connect
                    </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
