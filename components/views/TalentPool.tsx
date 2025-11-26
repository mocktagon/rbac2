
import React, { useState } from 'react';
import { Candidate, TalentList, ListCollaborator } from '../../types';
import { MOCK_TALENT_LISTS, MOCK_USERS, MOCK_PROJECTS } from '../../constants';
import { Search, Filter, Lock, Unlock, ChevronRight, X, Briefcase, MapPin, Users, Globe, Plus, Share2, MoreHorizontal, LayoutGrid, List as ListIcon, Shield, ChevronLeft, Settings, Calendar, User, ArrowRight, Info, Check } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ContextualInsight } from '../ui/ContextualInsight';
import { useToast } from '../../components/ui/Toast';

interface TalentPoolProps {
  candidates: Candidate[];
  isGlobalView: boolean;
  onManageAccess: () => void;
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
};

const TalentListCard: React.FC<{ list: TalentList; projectName?: string; onClick: () => void; onShare: (e: React.MouseEvent) => void }> = ({ list, projectName, onClick, onShare }) => {
    const owner = list.collaborators.find(c => c.role === 'Owner') || list.collaborators[0];
    const isGlobal = !list.projectId;

    return (
        <div 
            onClick={onClick}
            className={`group rounded-xl border p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full relative overflow-hidden ${
                isGlobal 
                ? 'bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100 hover:border-indigo-300' 
                : 'bg-white border-slate-200 hover:border-indigo-300'
            }`}
        >
            {isGlobal && (
                <div className="absolute top-0 right-0 p-3 opacity-5">
                    <Globe size={100} />
                </div>
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex gap-2">
                    {isGlobal ? (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-md flex items-center gap-1">
                            <Globe size={12} /> Global Reservoir
                        </span>
                    ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md flex items-center gap-1 max-w-[150px] truncate">
                            <Briefcase size={12} className="shrink-0" /> {projectName || 'Project List'}
                        </span>
                    )}
                </div>
                <button onClick={onShare} className="text-slate-400 hover:text-indigo-600 transition-colors p-1">
                    <Share2 size={16} />
                </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">{list.name}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">{list.description}</p>

            {/* Metadata Footer */}
            <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
                    <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                             {owner?.avatar || 'U'}
                         </div>
                         <div className="text-xs text-slate-500">
                             <p className="font-semibold text-slate-700">{owner?.name}</p>
                             <p className="text-[10px] opacity-70">{list.updatedAt}</p>
                         </div>
                    </div>
                    
                    {/* Recruiters Facepile */}
                    <div className="flex items-center -space-x-2">
                        {list.collaborators.slice(0, 3).map((c, i) => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 relative" title={c.name}>
                                {c.avatar}
                            </div>
                        ))}
                        {list.collaborators.length > 3 && (
                             <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">
                                +{list.collaborators.length - 3}
                             </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between bg-slate-50/80 p-2 rounded-lg">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wide px-1">Candidates</span>
                     <span className="text-sm font-bold text-indigo-600 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
                        {list.candidateCount}
                     </span>
                </div>
            </div>
        </div>
    );
};

export const TalentPool: React.FC<TalentPoolProps> = ({ candidates, isGlobalView, onManageAccess }) => {
  const [lists, setLists] = useState<TalentList[]>(MOCK_TALENT_LISTS);
  const [viewMode, setViewMode] = useState<'lists' | 'candidates'>('lists');
  const [selectedList, setSelectedList] = useState<TalentList | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showInsight, setShowInsight] = useState(true);
  
  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeShareList, setActiveShareList] = useState<TalentList | null>(null);
  
  // Create List State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'Global' | 'Project'>('Global');
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [newListProject, setNewListProject] = useState(MOCK_PROJECTS[0].id);

  const [searchTerm, setSearchTerm] = useState('');

  const recruiters = MOCK_USERS.filter(u => u.role === 'RECRUITER' || u.role === 'ORG_OWNER').slice(0,3);
  const { addToast } = useToast();

  const handleListClick = (list: TalentList) => {
      setSelectedList(list);
      setViewMode('candidates');
  };

  const openShare = (e: React.MouseEvent, list: TalentList) => {
      e.stopPropagation();
      setActiveShareList(list);
      setShowShareModal(true);
  };

  const handleCreateList = () => {
    const newList: TalentList = {
        id: `list-${Date.now()}`,
        name: newListName,
        description: newListDesc,
        projectId: createType === 'Project' ? newListProject : undefined,
        candidateCount: 0,
        updatedAt: 'Just now',
        collaborators: [{
            userId: 'u-1',
            name: 'Sarah Jenning', // Assuming current user context, hardcoded for mock
            avatar: 'SJ',
            role: 'Owner'
        }],
        tags: ['New']
    };
    setLists([...lists, newList]);
    setShowCreateModal(false);
    setNewListName('');
    setNewListDesc('');
  };

  const displayedLists = lists.filter(list => {
      if (!list.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (isGlobalView) return true;
      return !list.projectId || list.projectId === 'p-102'; 
  });

  const globalLists = displayedLists.filter(l => !l.projectId);
  const projectLists = displayedLists.filter(l => l.projectId);

  const displayedCandidates = selectedList?.projectId 
    ? candidates.filter(c => c.projectAffiliation === selectedList.projectId)
    : candidates;

  const getProjectName = (projectId?: string) => {
      if (!projectId) return undefined;
      return MOCK_PROJECTS.find(p => p.id === projectId)?.name || projectId;
  };

  return (
    <div className="flex h-full gap-6 relative">
      <div className={`flex-1 flex flex-col space-y-6 transition-all ${selectedCandidate ? 'w-1/2 pr-4' : 'w-full'}`}>
        
        {isGlobalView && showInsight && viewMode === 'lists' && (
            <ContextualInsight 
                type="talent"
                title="Cross-Project Talent Matching"
                description="Analysis detected 5 rejected candidates in 'Project Phoenix' that match the 'Senior Backend' role requirements for 'Cloud Native R&D' with >85% fit."
                metric="5 Matches"
                metricLabel="High Potential"
                actionLabel="Review Candidates"
                onAction={() => addToast('Candidates Filtered', 'Showing suggested matches.', 'success')}
                onDismiss={() => setShowInsight(false)}
            />
        )}

        {/* Header */}
        <div className="flex justify-between items-end">
            <div>
                 <div className="flex items-center gap-2 mb-2 text-sm text-slate-400 font-medium">
                    <span onClick={() => {setViewMode('lists'); setSelectedList(null)}} className="cursor-pointer hover:text-indigo-600 transition-colors">Talent Pools</span>
                    {selectedList && (
                        <>
                            <ChevronRight size={14} />
                            <span className="text-slate-900">{selectedList.name}</span>
                        </>
                    )}
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    {viewMode === 'lists' ? 'Talent Assets' : selectedList?.name}
                    {selectedList && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${selectedList.projectId ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                            {selectedList.projectId ? 'Project List' : 'Global Reservoir'}
                        </span>
                    )}
                 </h2>
            </div>
            
            <div className="flex gap-3">
                {viewMode === 'lists' && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search lists..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm" 
                        />
                    </div>
                )}
                
                {isGlobalView && viewMode === 'lists' && (
                    <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 pl-3 pr-1 rounded-lg shadow-sm">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Global Access</span>
                        <div className="flex items-center -space-x-2 px-2">
                             {recruiters.map((u, i) => (
                                <div key={i} className="w-6 h-6 rounded-full border border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600" title={u.name}>{u.avatar}</div>
                             ))}
                        </div>
                        <button onClick={onManageAccess} className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"><Settings size={14} /></button>
                    </div>
                )}

                <button 
                    onClick={() => { setCreateType('Global'); setShowCreateModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 text-sm shadow-md transition-all"
                >
                    <Plus size={16} /> {viewMode === 'lists' ? 'New List' : 'Add Candidate'}
                </button>
            </div>
        </div>

        {/* View Content */}
        {viewMode === 'lists' ? (
             <div className="space-y-8 overflow-y-auto pb-10">
                
                {/* Global Reservoirs Section */}
                {isGlobalView && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Globe size={16} className="text-indigo-600" /> Global Shared Pools
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {globalLists.map(list => (
                                <TalentListCard 
                                    key={list.id} 
                                    list={list} 
                                    onClick={() => handleListClick(list)} 
                                    onShare={(e) => openShare(e, list)} 
                                />
                            ))}
                            {/* New Global Pool Button */}
                            <button 
                                onClick={() => { setCreateType('Global'); setShowCreateModal(true); }}
                                className="border-2 border-dashed border-indigo-100 bg-indigo-50/20 rounded-xl flex flex-col items-center justify-center p-6 text-indigo-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group min-h-[250px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-white group-hover:scale-110 flex items-center justify-center mb-3 transition-all shadow-sm">
                                    <Plus size={24} className="text-indigo-600" />
                                </div>
                                <span className="font-bold text-sm">Create Global Reservoir</span>
                                <span className="text-xs text-indigo-400/70 mt-1">Shared Org-wide Asset</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Project Lists Section */}
                {(projectLists.length > 0 || !isGlobalView) && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Briefcase size={16} className="text-slate-500" /> Targeted Talent Lists
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projectLists.map(list => (
                                <TalentListCard 
                                    key={list.id} 
                                    list={list}
                                    projectName={getProjectName(list.projectId)}
                                    onClick={() => handleListClick(list)} 
                                    onShare={(e) => openShare(e, list)} 
                                />
                            ))}
                             {/* Create New Placeholder */}
                            <button 
                                onClick={() => { setCreateType('Project'); setShowCreateModal(true); }}
                                className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group min-h-[250px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center mb-3 transition-colors shadow-sm">
                                    <Plus size={24} />
                                </div>
                                <span className="font-bold text-sm">Create Project List</span>
                                <span className="text-xs text-slate-400 mt-1">Private or Shared</span>
                            </button>
                        </div>
                    </div>
                )}
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-10">
                {displayedCandidates.map(c => (
                    <CandidateCard key={c.id} candidate={c} onClick={() => setSelectedCandidate(c)} />
                ))}
            </div>
        )}
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-900">Create New Talent List</h3>
                      <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      {/* Type Selector (Only for Org Owner) */}
                      {isGlobalView && (
                          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                              <button 
                                onClick={() => setCreateType('Global')}
                                className={`py-2 text-sm font-bold rounded-md transition-all ${createType === 'Global' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                  Global Pool
                              </button>
                              <button 
                                onClick={() => setCreateType('Project')}
                                className={`py-2 text-sm font-bold rounded-md transition-all ${createType === 'Project' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                  Project List
                              </button>
                          </div>
                      )}

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">List Name</label>
                          <input 
                              type="text" 
                              value={newListName}
                              onChange={e => setNewListName(e.target.value)}
                              placeholder="e.g. Q4 Executive Search"
                              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                          />
                      </div>

                      {createType === 'Project' && isGlobalView && (
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign to Project</label>
                              <select 
                                value={newListProject} 
                                onChange={e => setNewListProject(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                              >
                                  {MOCK_PROJECTS.map(p => (
                                      <option key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                              </select>
                          </div>
                      )}

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                          <textarea 
                              value={newListDesc}
                              onChange={e => setNewListDesc(e.target.value)}
                              placeholder="Briefly describe the purpose of this list..."
                              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none" 
                          />
                      </div>
                      
                      <button 
                        disabled={!newListName}
                        onClick={handleCreateList}
                        className="w-full py-3 bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                      >
                          Create List
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Share Modal */}
      {showShareModal && activeShareList && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <h3 className="font-bold text-slate-900">Share "{activeShareList.name}"</h3>
                      <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-6">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 flex gap-2">
                        <Info size={16} className="text-indigo-600 shrink-0" />
                        <div>
                            Sharing this list grants access to all <span className="font-bold">{activeShareList.candidateCount} candidates</span> inside it. 
                            {activeShareList.projectId ? ' This is a Project-scoped list.' : ' This is a Global Reservoir.'}
                        </div>
                      </div>

                      <div className="flex gap-2">
                          <input type="text" placeholder="Add people by name or email..." className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                          <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700">Invite</button>
                      </div>

                      <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">People with access</h4>
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                              {activeShareList.collaborators.map((c, i) => (
                                  <div key={i} className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                              {c.avatar}
                                          </div>
                                          <div>
                                              <p className="text-sm font-bold text-slate-900">{c.name}</p>
                                              <p className="text-xs text-slate-500">{c.role}</p>
                                          </div>
                                      </div>
                                      <select className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded px-2 py-1 outline-none">
                                          <option selected={c.role === 'Owner'}>{c.role}</option>
                                          <option>Editor</option>
                                          <option>Viewer</option>
                                          <option className="text-red-600">Remove</option>
                                      </select>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Candidate Detail Drawer */}
      {selectedCandidate && (
        <div className="w-[450px] bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in slide-in-from-right-10 duration-200 h-full">
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
