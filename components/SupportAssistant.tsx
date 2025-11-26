
import React, { useState, useRef, useEffect } from 'react';
import { TourGuide, ChatMessage, ViewState } from '../types';
import { MOCK_GUIDES } from '../constants';
import { getSupportResponse } from '../services/geminiService';
import { X, MessageSquare, BookOpen, Send, Bot, User, ArrowRight, PlayCircle, ChevronRight, Sparkles } from 'lucide-react';

interface SupportAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    activeView: ViewState;
    onNavigate: (view: ViewState) => void;
}

export const SupportAssistant: React.FC<SupportAssistantProps> = ({ isOpen, onClose, activeView, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'guides' | 'chat'>('guides');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { id: 'msg-1', sender: 'ai', text: 'Hello! I am your Control Tower assistant. Ask me anything about governance, budgets, or how to configure the platform.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, activeTab]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = { id: `msg-${Date.now()}`, sender: 'user', text: input };
        setChatHistory(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const response = await getSupportResponse(input, activeView);
        
        setIsTyping(false);
        if (response) {
            const aiMsg: ChatMessage = { 
                id: `ai-${Date.now()}`, 
                sender: 'ai', 
                text: response.text,
                suggestedAction: response.suggestedView ? {
                    label: response.actionLabel || `Go to ${response.suggestedView}`,
                    view: response.suggestedView
                } : undefined
            };
            setChatHistory(prev => [...prev, aiMsg]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-[60] border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h3 className="font-bold text-slate-900">Support Center</h3>
                    <p className="text-xs text-slate-500">Virtual Tour & AI Help</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab('guides')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'guides' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <BookOpen size={16} /> Guides
                </button>
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Sparkles size={16} /> AI Assist
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative bg-slate-50/50">
                
                {/* GUIDE TAB */}
                {activeTab === 'guides' && (
                    <div className="h-full overflow-y-auto p-4 space-y-4">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-700 mb-2">
                            👋 Welcome to the Control Tower. Select a guide below to start a virtual walkthrough.
                        </div>
                        {MOCK_GUIDES.map(guide => (
                            <div key={guide.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wide">
                                        {guide.category}
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400">
                                        {guide.duration}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-800 mb-2">{guide.title}</h4>
                                <div className="space-y-2 mb-3">
                                    {guide.steps.slice(0, 2).map((step, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                                            <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                                {i + 1}
                                            </div>
                                            <span>{step.title}</span>
                                        </div>
                                    ))}
                                    {guide.steps.length > 2 && <p className="text-[10px] text-slate-400 pl-6">+ {guide.steps.length - 2} more steps</p>}
                                </div>
                                <button 
                                    onClick={() => onNavigate(guide.targetView)}
                                    className="w-full py-2 bg-white border border-slate-200 text-indigo-600 font-bold text-xs rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    <PlayCircle size={14} /> Start Tour
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* CHAT TAB */}
                {activeTab === 'chat' && (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatHistory.map(msg => (
                                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'ai' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'}`}>
                                        {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                                        msg.sender === 'user' 
                                        ? 'bg-slate-900 text-white rounded-tr-none' 
                                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                    }`}>
                                        {msg.text}
                                        {msg.suggestedAction && (
                                            <button 
                                                onClick={() => onNavigate(msg.suggestedAction!.view)}
                                                className="mt-3 w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-between px-3"
                                            >
                                                {msg.suggestedAction.label}
                                                <ChevronRight size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                        <Bot size={16} />
                                    </div>
                                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask about budgets, compliance..." 
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
