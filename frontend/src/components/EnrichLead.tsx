import React, { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, Play, Users, MapPin, Briefcase, AlertCircle, Copy, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../lib/utils';
import type { Lead } from '../types';
import ScoreCircle from './ScoreCircle';
import LeadCard from './LeadCard';

export default function EnrichLead() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Lead | null>(null);
  const [activeEmailTab, setActiveEmailTab] = useState<'ceo' | 'cfo' | 'head_of_finance'>('ceo');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleEnrich = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/enrich`, { domain });
      setResult(response.data);
    } catch (error) {
      console.error('Error enriching lead:', error);
      alert('Failed to enrich lead. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackProspect = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/api/leads`, result);
      // Silently succeed and reset the UI instead of blocking with an alert
      setResult(null);
      setDomain('');
    } catch (error) {
      console.error('Error saving prospect:', error);
      alert('Failed to track prospect. Make sure the backend is running.');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-12">
          Discover <span className="text-electric-blue">High-Fit</span> Prospects
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Enter a company domain to automatically research their profile, calculate their fintech fit score, and generate personalized outreach.
        </p>
      </div>

      <form onSubmit={handleEnrich} className="max-w-2xl mx-auto flex gap-3 relative">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="input-field pl-11 shadow-2xl shadow-electric-blue/5"
            placeholder="e.g. stripe.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !domain}
          className="btn-primary w-32 shadow-electric-blue/30"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Play className="w-4 h-4 mr-2" /> Enrich</>}
        </button>
      </form>

      {loading && (
        <div className="mt-16 flex flex-col items-center justify-center space-y-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-t-2 border-electric-blue animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-2 border-electric-blue/60 animate-spin flex items-center justify-center">
               <Loader2 className="w-8 h-8 text-electric-blue animate-pulse-slow" />
            </div>
          </div>
          <p className="text-electric-blue font-medium tracking-widest uppercase text-sm animate-pulse">Analyzing digital footprint...</p>
        </div>
      )}

      {result && !loading && (
        <div className="mt-12 space-y-6 animate-in slide-in-from-bottom-8 duration-700">
          
          {/* Top Row: Main Info & Score */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <LeadCard className="lg:col-span-2 p-8 space-y-6 relative overflow-hidden group h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/5 rounded-full blur-2xl -mr-20 -mt-20 group-hover:bg-electric-blue/10 transition duration-700 pointer-events-none" />
              
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">{result.company_name}</h2>
                  <div className="flex flex-wrap items-center text-slate-400 mt-2 gap-y-2 gap-x-4">
                    <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1 text-electric-blue" /> {result.industry}</span>
                    <span className="flex items-center"><Users className="w-4 h-4 mr-1 text-electric-blue" /> {result.size}</span>
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-electric-blue" /> {result.location}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Main Product</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{result.main_product}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Predicted Pain Points</h3>
                  <ul className="space-y-2">
                    {result.pain_points.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="pt-6 border-t border-navy-700/50 flex justify-end mt-auto">
                <button 
                  onClick={handleTrackProspect} 
                  disabled={saving}
                  className="btn-primary w-full sm:w-auto px-8"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                  Track Prospect
                </button>
              </div>
            </LeadCard>

            {/* Score Container */}
            <LeadCard className="p-8 flex flex-col items-center text-center h-full">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">ICP Fit Assessment</h3>
              <ScoreCircle score={result.fit_score} />
              <p className="mt-6 text-sm text-slate-300 leading-relaxed italic border-t border-navy-700 pt-6">"{result.fit_justification}"</p>
            </LeadCard>
          </div>

          {/* Bottom Row: Emails Container */}
          <LeadCard className="p-1 min-h-[320px] flex flex-col">
              <div className="flex p-1 space-x-1 bg-navy-900/50 rounded-t-lg border-b border-navy-700">
                {(['ceo', 'cfo', 'head_of_finance'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setActiveEmailTab(role)}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded capitalize transition-all ${
                      activeEmailTab === role 
                        ? 'bg-electric-blue text-white shadow' 
                        : 'text-slate-400 hover:text-white hover:bg-navy-800'
                    }`}
                  >
                    {role.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
              <div className="p-4 flex-1 flex flex-col relative group">
                <div className="flex justify-between items-start mb-3 gap-3">
                  <h4 className="text-sm font-semibold text-slate-200 pr-2">
                    Subject: {result.outreach_emails[activeEmailTab].subject}
                  </h4>
                  <button 
                    onClick={() => copyToClipboard(result.outreach_emails[activeEmailTab].body)}
                    className="flex-shrink-0 p-1.5 rounded-md bg-navy-700 hover:bg-electric-blue text-slate-300 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="bg-navy-900/50 p-3 rounded-md border border-navy-700 font-mono text-xs text-slate-300 flex-1 whitespace-pre-wrap overflow-y-auto">
                  {result.outreach_emails[activeEmailTab].body}
                </div>
              </div>
            </LeadCard>
        </div>
      )}
    </div>
  );
}
