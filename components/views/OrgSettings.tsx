import React, { useState } from 'react';
import { Shield, Database, Globe, Users, Lock, CheckCircle2, Key } from 'lucide-react';

export const OrgSettings = () => {
    const [allowExternal, setAllowExternal] = useState(false);
    const [allowFederation, setAllowFederation] = useState(false);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Organization Settings</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Security Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Privacy & Compliance</h3>
                            <p className="text-sm text-slate-500">GDPR, PII Masking, and Data Retention.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">Enforce PII Masking by Default</span>
                            <div className="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-700">Candidate Data Retention</span>
                            <select className="bg-slate-50 border border-slate-200 text-sm rounded px-2 py-1 outline-none">
                                <option>90 Days</option>
                                <option>1 Year</option>
                                <option>Indefinite</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-sm text-slate-700">Interview Recording Storage</span>
                            <select className="bg-slate-50 border border-slate-200 text-sm rounded px-2 py-1 outline-none">
                                <option>Store in Region</option>
                                <option>Global Bucket</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* External Access */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">External Access & Federation</h3>
                            <p className="text-sm text-slate-500">Manage 3rd party vendor, agency, and cross-tenant access.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Guest Domains */}
                        <div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Allow Guest Domains</p>
                                    <p className="text-xs text-slate-500">Permit non-corporate emails (e.g. gmail.com) to be invited.</p>
                                </div>
                                <button 
                                    onClick={() => setAllowExternal(!allowExternal)}
                                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${allowExternal ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${allowExternal ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div className={`transition-all mt-3 ${allowExternal ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Allowed Domains Whitelist</label>
                                <textarea 
                                    placeholder="e.g. agency.com, vendor.net (one per line)"
                                    className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        
                        {/* Outside Org IDs */}
                        <div className="pt-4 border-t border-slate-100">
                             <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Key size={14} className="text-amber-500" />
                                        External Org ID Federation
                                    </p>
                                    <p className="text-xs text-slate-500">Allow users from other Control Tower tenants to access resources via Org ID.</p>
                                </div>
                                <button 
                                    onClick={() => setAllowFederation(!allowFederation)}
                                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${allowFederation ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${allowFederation ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            {allowFederation && (
                                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-2">
                                    <p className="text-xs text-amber-800 font-medium">Warning: Users with valid Org IDs from outside your tenant will be able to view Public Assets if linked.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Global Data Assets */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Global Data Assets</h3>
                            <p className="text-sm text-slate-500">Blueprints and Talent Pools shared across the organization.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Global Blueprint Library</h4>
                                <CheckCircle2 size={16} className="text-emerald-500" />
                            </div>
                            <p className="text-sm text-slate-500 mt-1">24 Certified Templates available to all projects.</p>
                        </div>
                        <div className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Global Talent Reservoir</h4>
                                <CheckCircle2 size={16} className="text-emerald-500" />
                            </div>
                            <p className="text-sm text-slate-500 mt-1">14,500 Candidates indexed. 450 Shared via Unlock Requests.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};