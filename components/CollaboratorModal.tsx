
import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Globe, Users, Briefcase, Mail } from 'lucide-react';

interface CollaboratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeView: string;
}

export const CollaboratorModal: React.FC<CollaboratorModalProps> = ({ isOpen, onClose, activeView }) => {
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('Viewer');
    const [contextLabel, setContextLabel] = useState('Page Access');

    // Context-aware defaults
    useEffect(() => {
        if (activeView === 'finops') {
            setSelectedRole('Finance Viewer');
            setContextLabel('FinOps Dashboard');
        } else if (activeView === 'talent') {
            setSelectedRole('Recruiter');
            setContextLabel('Talent Pool');
        } else if (activeView === 'projects') {
            setSelectedRole('Project Admin');
            setContextLabel('Project Management');
        } else {
            setSelectedRole('Viewer');
            setContextLabel('General Access');
        }
    }, [activeView]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Invite Collaborators</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <Globe size={12} />
                            Adding users to <span className="font-bold text-indigo-600">{contextLabel}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Input Area */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@kyndryl.com" 
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                                />
                            </div>
                            <select 
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
                            >
                                <option>Viewer</option>
                                <option>Editor</option>
                                <option>Admin</option>
                                <option disabled className="text-slate-300">--- Context Specific ---</option>
                                <option value="Finance Viewer">Finance Viewer</option>
                                <option value="Finance Admin">Finance Admin</option>
                                <option value="Recruiter">Recruiter</option>
                                <option value="Project Admin">Project Admin</option>
                            </select>
                            <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg text-sm hover:bg-indigo-700 shadow-md">
                                Invite
                            </button>
                        </div>
                    </div>

                    {/* Permissions Preview */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                        <Shield className="text-blue-600 mt-0.5" size={18} />
                        <div>
                            <h4 className="text-sm font-bold text-blue-800">Permission Scope: {selectedRole}</h4>
                            <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                                {selectedRole.includes('Finance') 
                                    ? "User will have access to Billing, Invoices, and Usage metrics. They cannot modify Project settings."
                                    : selectedRole.includes('Recruiter')
                                    ? "User can view and edit Candidate Lists, schedule interviews, and leave feedback."
                                    : "Standard access to view resources in this section."
                                }
                            </p>
                        </div>
                    </div>

                    {/* Quick Add Suggested Users */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Suggested People</h4>
                        <div className="space-y-2">
                            {['Alice Finance (Finance Lead)', 'Bob Recruiter (Talent Acquisition)'].map((user, i) => (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {user.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">{user}</span>
                                    </div>
                                    <button className="text-indigo-600 opacity-0 group-hover:opacity-100 text-xs font-bold px-3 py-1 bg-indigo-50 rounded-full transition-all">
                                        + Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                    <p className="text-xs text-slate-400">Updates will be logged in the Audit Trail.</p>
                </div>
            </div>
        </div>
    );
};
