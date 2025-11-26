import React, { useState, useEffect } from 'react';
import { CreditRequest, AIAnalysisResponse, Project } from '../types';
import { X, Check, BrainCircuit, AlertTriangle, Info } from 'lucide-react';
import { analyzeCreditRequest } from '../services/geminiService';

interface RequestModalProps {
  request: CreditRequest | null;
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({ request, project, isOpen, onClose, onApprove, onReject }) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isOpen && request && project) {
      setAnalysis(null);
      setIsAnalyzing(true);
      
      // Call Gemini Service
      analyzeCreditRequest(project.name, request.amountRequested, request.reason, project.budget.used)
        .then(res => {
          setAnalysis(res);
        })
        .finally(() => {
          setIsAnalyzing(false);
        });
    }
  }, [isOpen, request, project]);

  if (!isOpen || !request || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
                <h3 className="text-lg font-bold text-slate-900">Governance Approval</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Credit Expansion Request</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Project Context */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Project</p>
                    <p className="text-slate-900 font-bold">{request.projectName}</p>
                    <p className="text-sm text-slate-600 mt-1">Cost Center: {project.costCenter}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Current Usage</p>
                    <p className="text-red-600 font-bold">{project.budget.used} / {project.budget.hardLimit}</p>
                </div>
            </div>

            {/* Request Details */}
            <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Request Details</h4>
                <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-600 text-sm">Amount Requested</span>
                        <span className="font-bold text-indigo-600 text-lg">+{request.amountRequested} Credits</span>
                    </div>
                    <div>
                         <span className="text-slate-600 text-sm block mb-1">Reason Provided</span>
                         <div className="p-3 bg-white border border-slate-200 rounded-md text-slate-700 text-sm italic">
                            "{request.reason}"
                         </div>
                    </div>
                </div>
            </div>

            {/* AI Analysis Section */}
            <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                    <BrainCircuit size={18} className="text-indigo-600" />
                    <h4 className="text-sm font-bold text-indigo-900">AI Risk Analysis</h4>
                    {isAnalyzing && <span className="text-xs text-indigo-500 animate-pulse">Processing...</span>}
                </div>

                {isAnalyzing ? (
                   <div className="h-16 bg-white/50 animate-pulse rounded-md"></div> 
                ) : analysis ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-indigo-200 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${analysis.riskScore > 50 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                                    style={{width: `${analysis.riskScore}%`}}
                                />
                            </div>
                            <span className={`text-xs font-bold ${analysis.riskScore > 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                                Risk: {analysis.riskScore}/100
                            </span>
                        </div>
                        
                        <div className="flex gap-2 items-start">
                             {analysis.recommendation === 'APPROVE' ? (
                                <Check size={16} className="text-emerald-600 mt-0.5" />
                             ) : (
                                <AlertTriangle size={16} className="text-amber-600 mt-0.5" />
                             )}
                             <div>
                                <span className={`text-xs font-bold uppercase ${
                                    analysis.recommendation === 'APPROVE' ? 'text-emerald-700' : 'text-amber-700'
                                }`}>
                                    Recommendation: {analysis.recommendation}
                                </span>
                                <p className="text-sm text-slate-700 mt-1 leading-snug">
                                    {analysis.summary}
                                </p>
                             </div>
                        </div>
                    </div>
                ) : (
                   <p className="text-xs text-slate-400">Analysis unavailable (Check API Key)</p> 
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
            <button 
                onClick={() => onReject(request.id)}
                className="px-4 py-2 border border-slate-300 bg-white text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
                Reject Request
            </button>
            <button 
                onClick={() => onApprove(request.id)}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors flex items-center gap-2"
            >
                <Check size={18} /> Approve Expansion
            </button>
        </div>
      </div>
    </div>
  );
};