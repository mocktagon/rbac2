import React from 'react';
import { CreditCard, Shield, Database, Activity } from 'lucide-react';

export const OrgSettings = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900">Organization Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Billing Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Billing & Credits</h3>
                            <p className="text-sm text-slate-500">Manage org-wide spending limits.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Total Available Credits</span>
                            <span className="text-lg font-bold text-slate-900">45,200</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-slate-700">Monthly Burn Rate</span>
                            <span className="text-lg font-bold text-slate-900">~12,000 / mo</span>
                        </div>
                        <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                            Purchase Credits
                        </button>
                    </div>
                </div>

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
                            <select className="bg-slate-50 border border-slate-200 text-sm rounded px-2 py-1">
                                <option>90 Days</option>
                                <option>1 Year</option>
                                <option>Indefinite</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-sm text-slate-700">Interview Recording Storage</span>
                            <select className="bg-slate-50 border border-slate-200 text-sm rounded px-2 py-1">
                                <option>Store in Region</option>
                                <option>Global Bucket</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Global Data Assets */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
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
                        <div className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                            <h4 className="font-bold text-slate-800">Global Blueprint Library</h4>
                            <p className="text-sm text-slate-500 mt-1">24 Certified Templates available to all projects.</p>
                        </div>
                        <div className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                            <h4 className="font-bold text-slate-800">Global Talent Reservoir</h4>
                            <p className="text-sm text-slate-500 mt-1">14,500 Candidates indexed. 450 Shared via Unlock Requests.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};