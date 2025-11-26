
import React, { useState } from 'react';
import { Candidate } from '../../types';
import { Search, Filter, Lock, Unlock, Download, ChevronRight, X, Briefcase, MapPin } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface TalentPoolProps {
  candidates: Candidate[];
  isGlobalView: boolean;
}

const CandidateCard: React.FC<{ candidate: Candidate; onClick: () => void }> = ({ candidate, onClick }) => {
    // Determine color based on score
    let scoreColor = 'text-slate-600 bg-slate-100';
    if(candidate.matchScore > 80) scoreColor = 'text-emerald-700 bg-emerald-100';
    else if(candidate.matchScore < 40) scoreColor = 'text-red-700 bg-red-100';
    else scoreColor = 'text-amber-700 bg-amber-100';

    return (
        <div 
            onClick={onClick}
            className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-full bg-slate-200 object-cover" />
                    <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{candidate.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <Briefcase size={12} />
                            <span>{candidate.role}</span>
                        </div>
                    </div>
                </div>
                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${scoreColor}`}>
                    <span className="text-xl font-bold leading-none">{candidate.matchScore}</span>
                    <span className="text-[9px] uppercase font-bold opacity-80">Match</span>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <MapPin size={12} />
                {candidate.location}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {candidate.skills.slice(0, 3).map(skill => (
                    <span key={skill.name} className="text-[10px] font-medium px-2 py-1 rounded bg-slate-50 text-slate-600 border border-slate-100">
                        {skill.name}
                    </span>
                ))}
                {candidate.skills.length > 3 && (
                    <span className="text-[10px] font-medium px-2 py-1 rounded bg-slate-50 text-slate-400 border border-slate-100">
                        +{candidate.skills.length - 3}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    candidate.status === 'New' ? 'bg-blue-50 text-blue-600' :
                    candidate.status === 'Interviewing' ? 'bg-indigo-50 text-indigo-600' :
                    candidate.status === 'Pooled' ? 'bg-slate-100 text-slate-600' :
                    'bg-slate-50 text-slate-600'
                }`}>
                    {candidate.status}
                </span>
                <span className="text-xs text-slate-400">{candidate.appliedDate}</span>
            </div>
            
            {!candidate.projectAffiliation && (
                <div className="absolute top-2 right-2 text-amber-400" title="Locked / Global Pool">
                    <Lock size={14} />
                </div>
            )}
        </div>
    );
}

export const TalentPool: React.FC<TalentPoolProps> = ({ candidates, isGlobalView }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  return (
    <div className="flex h-full gap-6">
      {/* List Section */}
      <div className={`flex-1 flex flex-col space-y-6 transition-all ${selectedCandidate ? 'w-1/2' : 'w-full'}`}>
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {isGlobalView ? 'Global Talent Reservoir' : 'Project Talent Pool'}
                </h2>
                <p className="text-slate-500 mt-1">
                    {isGlobalView ? 'Access to 14,500+ candidates across the organization.' : 'Candidates assigned to your project scope.'}
                </p>
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 text-sm">
                    <Download size={16} /> Export
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 text-sm shadow-md">
                    + Add Candidate
                </button>
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search by name, skill, or role..." className="w-full pl-10 pr-4 py-2 bg-transparent text-sm outline-none text-slate-900 placeholder-slate-400" />
            </div>
            <div className="w-px bg-slate-200 my-1"></div>
            <button className="px-4 py-2 text-slate-600 hover:text-indigo-600 text-sm font-medium flex items-center gap-2">
                <Filter size={16} /> Filters
            </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pb-10">
            {candidates.map(c => (
                <CandidateCard key={c.id} candidate={c} onClick={() => setSelectedCandidate(c)} />
            ))}
        </div>
      </div>

      {/* Detail Panel / Drawer */}
      {selectedCandidate && (
        <div className="w-[450px] bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in slide-in-from-right-10 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <img src={selectedCandidate.avatar} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" alt="avatar" />
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedCandidate.name}</h3>
                        <p className="text-slate-500 text-sm">{selectedCandidate.role}</p>
                    </div>
                </div>
                <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600 p-1">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Score & Status */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                        <span className="block text-3xl font-bold text-slate-900">{selectedCandidate.matchScore}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Fit Score</span>
                    </div>
                     <div className="flex-1 bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                        <span className="block text-lg font-bold text-slate-900">{selectedCandidate.status}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Status</span>
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="bg-white border border-slate-100 rounded-xl p-2 relative">
                    <h4 className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider z-10">Skill Analysis</h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={selectedCandidate.skills}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                                name={selectedCandidate.name}
                                dataKey="score"
                                stroke="#4f46e5"
                                strokeWidth={2}
                                fill="#6366f1"
                                fillOpacity={0.2}
                            />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recommendations */}
                <div className={`p-4 rounded-xl border ${selectedCandidate.matchScore > 70 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <h4 className={`text-sm font-bold mb-1 ${selectedCandidate.matchScore > 70 ? 'text-emerald-800' : 'text-red-800'}`}>
                        {selectedCandidate.matchScore > 70 ? 'Recommended' : 'Do Not Recommend'}
                    </h4>
                    <p className={`text-xs ${selectedCandidate.matchScore > 70 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {selectedCandidate.matchScore > 70 
                         ? "Candidate demonstrates strong competency in key areas required for the role." 
                         : "Candidate lacks depth in core required skills, specifically compliance and reporting."}
                    </p>
                </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
                {!selectedCandidate.projectAffiliation ? (
                    <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors">
                        <Unlock size={18} /> Request Unlock
                    </button>
                ) : (
                    <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-colors">
                        View Full Profile
                    </button>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
