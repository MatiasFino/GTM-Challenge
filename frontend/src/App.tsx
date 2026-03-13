import { useState } from 'react';
import Navbar from './components/Navbar';
import EnrichLead from './components/EnrichLead';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState<'enrich' | 'dashboard'>('enrich');

  return (
    <div className="min-h-screen bg-navy-900 text-slate-300 font-sans selection:bg-electric-blue selection:text-white">
      {/* Background Glow Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-electric-blue/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-electric-blue/5 blur-[120px]" />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[1400px] mx-auto overflow-hidden">
        {activeTab === 'enrich' ? <EnrichLead /> : <Dashboard />}
      </main>
    </div>
  );
}

export default App;
