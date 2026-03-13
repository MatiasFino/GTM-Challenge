import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Target, Users, TrendingUp, ChevronDown, Trash2 } from 'lucide-react';
import { API_BASE_URL, cn } from '../lib/utils';
import type { Lead } from '../types';
import LeadCard from './LeadCard';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/leads`);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/leads/${id}`);
      setLeads(leads.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const sortedLeads = React.useMemo(() => {
    let sortable = [...leads];
    const currentSort = sortConfig;
    if (currentSort !== null) {
      sortable.sort((a, b) => {
        const valA: any = a[currentSort.key] || "";
        const valB: any = b[currentSort.key] || "";
        if (valA < valB) {
          return currentSort.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return currentSort.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [leads, sortConfig]);

  const requestSort = (key: keyof Lead) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const metrics = {
    total: leads.length,
    avgScore: leads.length ? Math.round(leads.reduce((acc, l) => acc + l.fit_score, 0) / leads.length) : 0,
    highFit: leads.filter(l => l.fit_score >= 70).length,
  };

  const chartData = leads.map(l => ({
    name: l.company_name,
    score: l.fit_score,
    fill: l.fit_score >= 70 ? '#22c55e' : l.fit_score >= 40 ? '#facc15' : '#ef4444'
  }));

  const industries = React.useMemo(() => Array.from(new Set(leads.map(l => l.industry))), [leads]);

  const scatterData = leads.map(l => ({
    name: l.company_name,
    score: l.fit_score,
    industryIdx: industries.indexOf(l.industry),
    industry: l.industry
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <LeadCard className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase">Total Leads</p>
            <p className="text-4xl font-bold text-white mt-2">{metrics.total}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-navy-700/50 flex items-center justify-center border border-navy-600">
            <Users className="w-6 h-6 text-electric-blue" />
          </div>
        </LeadCard>
        
        <LeadCard className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase">Average Fit</p>
            <p className="text-4xl font-bold text-white mt-2">{metrics.avgScore}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-navy-700/50 flex items-center justify-center border border-navy-600">
            <Target className="w-6 h-6 text-electric-blue" />
          </div>
        </LeadCard>
        
        <LeadCard className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase">High Fit (&gt;70)</p>
            <p className="text-4xl font-bold text-green-400 mt-2">{metrics.highFit}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-navy-700/50 flex items-center justify-center border border-navy-600">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
        </LeadCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadCard className="p-6" hoverEffect={false}>
          <h3 className="text-lg font-semibold text-white mb-6">Pipeline Fit Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: any) => [value, 'Fit Score']}
                  cursor={{fill: '#1E293B', opacity: 0.4}}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </LeadCard>

        <LeadCard className="p-6" hoverEffect={false}>
          <h3 className="text-lg font-semibold text-white mb-6">Clients by Industry</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis 
                  type="number" 
                  dataKey="industryIdx" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(val) => {
                    const name = industries[val];
                    return name && name.length > 20 ? name.substring(0, 20) + '...' : name || '';
                  }}
                  domain={[-1, industries.length]}
                  ticks={industries.map((_, i) => i)}
                />
                <YAxis type="number" dataKey="score" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <ZAxis range={[50, 50]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                  formatter={(value, name) => {
                    if (name === 'score') return [value, 'Fit Score'];
                    return [value, name];
                  }}
                  labelFormatter={() => `Company`}
                />
                <Scatter name="Leads" data={scatterData} fill="#3B82F6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </LeadCard>
      </div>

      <LeadCard className="overflow-hidden" hoverEffect={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-navy-900/50 border-b border-navy-700 text-xs uppercase font-semibold text-slate-400">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('company_name')}>
                  <div className="flex items-center">Company <ChevronDown className="w-3 h-3 ml-1" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('industry')}>
                  <div className="flex items-center">Industry <ChevronDown className="w-3 h-3 ml-1" /></div>
                </th>
                <th className="px-6 py-4 hidden sm:table-cell">Size</th>
                <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('fit_score')}>
                  <div className="flex items-center">Score <ChevronDown className="w-3 h-3 ml-1" /></div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td>
                </tr>
              ) : sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No leads in pipeline yet. Enrich a lead to get started.</td>
                </tr>
              ) : (
                sortedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-navy-700/30 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{lead.company_name}</td>
                    <td className="px-6 py-4">{lead.industry}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">{lead.size}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold",
                        lead.fit_score >= 70 ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        lead.fit_score >= 40 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                        "bg-red-500/20 text-red-500 border border-red-500/30"
                      )}>
                        {lead.fit_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => handleDelete(lead.id!, e)}
                        className="p-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </LeadCard>
    </div>
  );
}
