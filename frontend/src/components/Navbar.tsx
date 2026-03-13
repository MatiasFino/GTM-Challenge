
import { Activity, Target } from 'lucide-react';

interface NavbarProps {
  activeTab: 'enrich' | 'dashboard';
  setActiveTab: (tab: 'enrich' | 'dashboard') => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-navy-700 bg-navy-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-electric-blue flex items-center justify-center shadow-lg shadow-electric-blue/30">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Fintech AI <span className="text-electric-blue">GTM</span></span>
          </div>
          
          <div className="flex space-x-1 p-1 bg-navy-800 rounded-lg border border-navy-700">
            <button
              onClick={() => setActiveTab('enrich')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'enrich' 
                  ? 'bg-electric-blue text-white shadow-lg shadow-electric-blue/20' 
                  : 'text-slate-400 hover:text-white hover:bg-navy-700'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Enrich Lead</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-electric-blue text-white shadow-lg shadow-electric-blue/20' 
                  : 'text-slate-400 hover:text-white hover:bg-navy-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Pipeline Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
