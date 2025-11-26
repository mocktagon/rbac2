
import React, { useState } from 'react';
import { FINOPS_DATA, UNIT_ECONOMICS, MOCK_INVOICES, MOCK_PAYMENT_METHODS, MOCK_USAGE_LOGS, MOCK_USERS } from '../../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Info, CreditCard, Download, Settings, RefreshCw, AlertCircle, ArrowUpRight, ArrowDownRight, Wallet, Users, Lock, CheckCircle2 } from 'lucide-react';
import { ContextualInsight } from '../ui/ContextualInsight';
import { useToast } from '../../components/ui/Toast';

interface FinOpsViewProps {
    onManageAccess: () => void;
}

export const FinOpsView: React.FC<FinOpsViewProps> = ({ onManageAccess }) => {
    const [activeTab, setActiveTab] = useState<'Overview' | 'Billing' | 'Usage'>('Overview');
    const [autoRecharge, setAutoRecharge] = useState(true);
    const [showInsight, setShowInsight] = useState(true);

    const totalForecast = FINOPS_DATA.reduce((acc, curr) => acc + curr.forecast, 0);

    const { addToast } = useToast();

    // Mock specific users for FinOps facepile
    const finOpsUsers = MOCK_USERS.filter(u => u.role === 'FINANCE_ADMIN' || u.role === 'ORG_OWNER');

    const OverviewTab = () => (
        <div className="space-y-8 animate-in fade-in duration-300">
             {/* KPI Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={80} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <h3 className="font-bold text-slate-700">Projected Q4 Spend</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{totalForecast.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs text-red-500 font-bold mt-1">
                        <ArrowUpRight size={14} /> +12% vs previous quarter
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={80} className="text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="font-bold text-slate-700">Efficiency Savings</h3>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">$14,250</p>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1">
                        <ArrowDownRight size={14} /> via Bulk Purchasing
                    </div>
                </div>
                
                {/* Budget Health - Replaced SVG with Recharts */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-slate-700">Budget Health</h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                            <CheckCircle2 size={12} /> On Track
                        </div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center relative min-h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ value: 65 }, { value: 35 }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#6366f1" />
                                    <Cell fill="#f1f5f9" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-slate-900">65%</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">Consumed</span>
                        </div>
                    </div>
                    
                    <div className="mt-2 text-center">
                        <p className="text-xs text-slate-500">
                            Spending is <span className="font-bold text-emerald-600">5% lower</span> than forecasted.
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">Cost Breakdown <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">By Tier</span></h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={FINOPS_DATA} stackOffset="expand">
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val*100}%`} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                                <Bar dataKey="tier1Spend" name="Async/Standard" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="tier2Spend" name="Live Voice" stackId="a" fill="#8b5cf6" />
                                <Bar dataKey="tier3Spend" name="Expert Code" stackId="a" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Spend Forecast vs Actual</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={FINOPS_DATA}>
                                <defs>
                                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorForecast)" />
                                <Area type="monotone" dataKey="tier3Spend" stroke="#6366f1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" name="Actual Trend" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );

    const BillingTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
             {/* Left Column: Wallet & Methods */}
             <div className="space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Current Balance</p>
                            <h3 className="text-4xl font-bold">12,450 <span className="text-lg text-slate-400 font-normal">Credits</span></h3>
                        </div>
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <Wallet size={24} className="text-indigo-400" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-sm transition-colors">
                            + Add Funds
                        </button>
                        <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-sm transition-colors">
                            Transfer
                        </button>
                    </div>
                </div>

                {/* Auto Recharge */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <RefreshCw size={18} className="text-slate-400" /> Auto-Recharge
                        </h4>
                        <button 
                            onClick={() => setAutoRecharge(!autoRecharge)}
                            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${autoRecharge ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${autoRecharge ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Automatically add funds when balance drops below threshold to prevent service interruption.</p>
                    
                    <div className={`space-y-4 transition-opacity ${autoRecharge ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">When balance falls below</label>
                            <div className="relative">
                                <input type="number" defaultValue={2000} className="w-full pl-3 pr-12 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none focus:border-indigo-500" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Credits</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Add Amount</label>
                            <div className="relative">
                                <input type="number" defaultValue={5000} className="w-full pl-3 pr-12 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none focus:border-indigo-500" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Credits</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-900">Payment Methods</h4>
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">+ Add New</button>
                    </div>
                    <div className="space-y-3">
                        {MOCK_PAYMENT_METHODS.map(pm => (
                            <div key={pm.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-50 rounded text-slate-600">
                                        <CreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">•••• {pm.last4}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">{pm.type} {pm.expiry && `• Exp ${pm.expiry}`}</p>
                                    </div>
                                </div>
                                {pm.isDefault && <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">Default</span>}
                            </div>
                        ))}
                    </div>
                </div>
             </div>

             {/* Right Column: Invoices */}
             <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Invoice History</h3>
                    <button className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                        <Download size={14} /> Download All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice #</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_INVOICES.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{inv.invoiceNumber}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">${inv.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{inv.items} interviews</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                            inv.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 justify-end ml-auto">
                                            <Download size={14} /> PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );

    const UsageTab = () => (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Unit Economics Reference */}
            <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Info size={18} className="text-slate-400" /> Unit Economics Reference
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {UNIT_ECONOMICS.map((tier) => (
                        <div key={tier.tierName} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="font-bold text-slate-800 text-lg">{tier.tierName}</h4>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">x{tier.modelComplexityFactor} Model</span>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-1">
                                ${tier.baseCost} <span className="text-sm font-medium text-slate-400">/ session</span>
                            </div>
                            <p className="text-xs text-indigo-600 font-bold mb-4">
                                + ${tier.durationMultiplier}/min overage
                            </p>
                            <p className="text-sm text-slate-500 border-t border-slate-100 pt-3">
                                {tier.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Granular Usage Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-slate-900">Project Usage Breakdown</h3>
                        <p className="text-sm text-slate-500">Real-time consumption metrics by cost center.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                            Filter
                        </button>
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 shadow-sm">
                            Generate Report
                        </button>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project / Cost Center</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service Tier</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Sessions</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Total Cost</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Trend</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_USAGE_LOGS.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900 text-sm">{log.project}</p>
                                    <p className="text-xs text-slate-500">{log.costCenter}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                        log.tier.includes('Live') ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                        log.tier.includes('Expert') ? 'bg-pink-50 text-pink-700 border-pink-100' :
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    }`}>
                                        {log.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center text-sm font-medium text-slate-700">
                                    {log.sessions}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">
                                    ${log.cost.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`text-xs font-bold flex items-center justify-end gap-1 ${log.trend > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                        {log.trend > 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                                        {Math.abs(log.trend)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Settings size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Interactive Simulator (Mock Control) */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Budget Simulator</h3>
                        <p className="text-slate-400 text-sm max-w-md">Adjust project allocation caps to visualize impact on runway and service tier availability.</p>
                    </div>
                    <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors shadow-lg">
                        Run Simulation
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 h-full flex flex-col">
            
            {showInsight && (
                <ContextualInsight 
                    type="opportunity"
                    title="Optimization Opportunity"
                    description="Analysis of 450 sessions in 'Alpha Migration' shows 40% utilized 'Live Voice' but only required 'Standard Async' models."
                    metric="$4.2k"
                    metricLabel="Potential Savings"
                    actionLabel="Apply Policy"
                    onAction={() => addToast('Policy Applied', 'Tier downgrades enforced for non-critical interviews.', 'success')}
                    onDismiss={() => setShowInsight(false)}
                />
            )}

            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Financial Operations</h2>
                    <p className="text-slate-500">Monitor unit economics, manage invoices, and control usage.</p>
                </div>
                
                {/* Contextual Access Control Bar */}
                <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 pr-4 rounded-xl shadow-sm">
                    <div className="flex items-center -space-x-2 pl-2">
                        {finOpsUsers.map((u, i) => (
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
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Team Access</p>
                         <p className="text-xs font-bold text-slate-900">Finance Admins</p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200 flex space-x-8">
                {(['Overview', 'Billing', 'Usage'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold transition-all relative ${
                            activeTab === tab 
                            ? 'text-indigo-600' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1">
                {activeTab === 'Overview' && <OverviewTab />}
                {activeTab === 'Billing' && <BillingTab />}
                {activeTab === 'Usage' && <UsageTab />}
            </div>
        </div>
    );
};
