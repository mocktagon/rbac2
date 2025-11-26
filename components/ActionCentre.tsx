import React, { useState } from 'react';
import { ActionItem } from '../types';
import { MOCK_ACTIONS } from '../constants';
import { Sparkles, AlertTriangle, CheckCircle2, Clock, ArrowRight, BrainCircuit, X } from 'lucide-react';

interface ActionCentreProps {
    onActionClick?: (id: string) => void;
}

export const ActionCentre: React.FC<ActionCentreProps> = ({ onActionClick }) => {
    const [activeTab, setActiveTab] = useState<'Tasks' | 'Insights'>('Tasks');

    const tasks = MOCK_ACTIONS.filter(a => a.type === 'Approval' || a.type === 'Alert');
    const insights = MOCK_ACTIONS.filter(a => a.type === 'Insight' || a.type === 'Suggestion');

    const displayedItems = activeTab === 'Tasks' ? tasks : insights;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                        <BrainCircuit size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight">Intelligence Hub</h3>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Action Center</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab('Tasks')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Tasks' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Tasks <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px]">{tasks.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('Insights')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'Insights' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    AI Insights <Sparkles size={12} className={activeTab === 'Insights' ? 'text-indigo-600' : 'text-slate-400'} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {displayedItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                        {/* Status Line */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${
                            item.priority === 'High' ? 'bg-red-500' : 
                            item.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                        }`} />

                        <div className="flex justify-between items-start mb-2 pl-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                item.type === 'Alert' ? 'bg-red-50 text-red-600' :
                                item.type === 'Approval' ? 'bg-amber-50 text-amber-600' :
                                item.type === 'Insight' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                                {item.type}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Clock size={10} /> {item.timestamp}
                            </span>
                        </div>

                        <h4 className="font-bold text-slate-800 text-sm mb-1 pl-2">{item.title}</h4>
                        <p className="text-xs text-slate-500 pl-2 leading-relaxed mb-3">
                            {item.description}
                        </p>

                        {item.aiConfidence && (
                            <div className="flex items-center gap-1 pl-2 mb-3">
                                <Sparkles size={10} className="text-indigo-500" />
                                <span className="text-[10px] font-bold text-indigo-600">{item.aiConfidence}% AI Confidence</span>
                            </div>
                        )}

                        <div className="pl-2">
                            <button 
                                onClick={() => onActionClick && onActionClick(item.id)}
                                className="w-full py-2 bg-slate-50 group-hover:bg-slate-100 text-slate-600 group-hover:text-slate-900 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {item.actionLabel} <ArrowRight size={12} />
                            </button>
                        </div>
                    </div>
                ))}

                {displayedItems.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <CheckCircle2 size={40} className="mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-medium text-slate-500">All caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};