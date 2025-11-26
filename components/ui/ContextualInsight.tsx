
import React from 'react';
import { Sparkles, ArrowRight, X, BrainCircuit, TrendingUp, ShieldAlert, DollarSign, Users } from 'lucide-react';

interface ContextualInsightProps {
  type: 'risk' | 'opportunity' | 'talent' | 'security';
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  onAction: () => void;
  actionLabel: string;
  onDismiss?: () => void;
}

export const ContextualInsight: React.FC<ContextualInsightProps> = ({ 
  type, title, description, metric, metricLabel, onAction, actionLabel, onDismiss 
}) => {
  const styles = {
    risk: {
      bg: 'bg-gradient-to-r from-red-50 to-white',
      border: 'border-red-100',
      icon: <ShieldAlert size={20} className="text-red-600" />,
      metricColor: 'text-red-700',
      btn: 'bg-red-600 hover:bg-red-700 text-white'
    },
    opportunity: {
      bg: 'bg-gradient-to-r from-emerald-50 to-white',
      border: 'border-emerald-100',
      icon: <TrendingUp size={20} className="text-emerald-600" />,
      metricColor: 'text-emerald-700',
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white'
    },
    talent: {
      bg: 'bg-gradient-to-r from-violet-50 to-white',
      border: 'border-violet-100',
      icon: <Users size={20} className="text-violet-600" />,
      metricColor: 'text-violet-700',
      btn: 'bg-violet-600 hover:bg-violet-700 text-white'
    },
    security: {
      bg: 'bg-gradient-to-r from-amber-50 to-white',
      border: 'border-amber-100',
      icon: <BrainCircuit size={20} className="text-amber-600" />,
      metricColor: 'text-amber-700',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white'
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`rounded-xl border ${currentStyle.border} ${currentStyle.bg} p-1 shadow-sm mb-6 animate-in slide-in-from-top-2 duration-500`}>
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-5 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-current opacity-5 blur-xl pointer-events-none"></div>
        
        {/* Icon Area */}
        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
          {currentStyle.icon}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={12} className={currentStyle.metricColor} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStyle.metricColor}`}>
              AI Observation
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        {/* Metric Area */}
        <div className="flex items-center gap-6 border-l border-slate-200 pl-6 md:pr-6">
          <div>
            <p className={`text-2xl font-bold ${currentStyle.metricColor}`}>{metric}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase">{metricLabel}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onAction}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2 ${currentStyle.btn}`}
          >
            {actionLabel} <ArrowRight size={16} />
          </button>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
