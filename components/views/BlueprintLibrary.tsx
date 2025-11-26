
import React, { useState } from 'react';
import { Blueprint } from '../../types';
import { Globe, Lock, Search, SlidersHorizontal, FileCog, MoreVertical, Plus } from 'lucide-react';

interface BlueprintLibraryProps {
  blueprints: Blueprint[];
}

export const BlueprintLibrary: React.FC<BlueprintLibraryProps> = ({ blueprints }) => {
  const [filter, setFilter] = useState<'All' | 'Global' | 'Private'>('All');

  const filtered = blueprints.filter(b => filter === 'All' || b.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Interview Templates</h2>
          <p className="text-slate-500 mt-1">Standardized assessment structures for consistent hiring.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 shadow-md text-sm flex items-center gap-2">
            <Plus size={16} /> Create Template
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex gap-4 p-2 pl-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search templates..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64" />
             </div>
        </div>
        
        <div className="flex items-center gap-2 pr-2">
             <span className="text-xs font-semibold text-slate-500 uppercase mr-2">View:</span>
             <button 
                onClick={() => setFilter('All')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'All' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
             >
                All
             </button>
             <button 
                onClick={() => setFilter('Global')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'Global' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-900'}`}
             >
                Global
             </button>
             <button 
                onClick={() => setFilter('Private')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === 'Private' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:text-slate-900'}`}
             >
                Private
             </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Template Name</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tags</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Scope</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filtered.map((bp) => (
                    <tr key={bp.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${bp.type === 'Global' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                    <FileCog size={18} />
                                </div>
                                <div>
                                    <span className="font-bold text-slate-900 block">{bp.title}</span>
                                    <span className="text-xs text-slate-500">{bp.role}</span>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                             <div className="flex gap-1">
                                {bp.tags?.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] rounded-full font-medium">
                                        {tag}
                                    </span>
                                ))}
                             </div>
                        </td>
                        <td className="px-6 py-4">
                            {bp.type === 'Global' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    <Globe size={10} /> Global Asset
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                    <Lock size={10} /> Private
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-600">{bp.usageCount}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{bp.lastUpdated}</td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                                <MoreVertical size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
